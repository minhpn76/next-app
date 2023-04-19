import axios, { AxiosError } from 'axios';
import qs from 'qs';
import { v4 as uuidv4 } from 'uuid';
import { HEADER_TRACE_KEY, ANONYMOUS_ACCESS_APIs } from '@/helpers/constants';
import notifier from '@/helpers/notifier';
import { cleanObject, isTrue, loginRedirect } from '@/helpers/utils';
import { API_LOGOUT_ENDPOINT } from '@/modules/common/constants';
import { getUdfToken } from '@/modules/common/services';
import { TApigeeError, TError } from '@/modules/common/types';

/**
 * Global setup axios: baseURL, request interceptors, response interceptors
 */
export const setupAxios = () => {
  // console.log('setupAxios====================', typeof window === 'undefined');
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_HOST;
  axios.interceptors.request.use(async function (config: any) {
    const uuid = uuidv4();
    config.headers = { ...config.headers, [HEADER_TRACE_KEY]: uuid };
    //attach access_token to each of the request except get token APIs
    if (config.url) {
      const url = config.url;
      if (ANONYMOUS_ACCESS_APIs.findIndex(item => url.indexOf(item) > -1) === -1) {
        if (!config.headers || !config.headers['Authorization']) {
          //The AbortController interface represents a controller object that allows you to abort one or more Web requests.
          const abortController = new AbortController();
          const token = await getUdfToken();
          if (!token) {
            //Cancelling the API request before it has completed. when the refresh token is expired.
            const abortConfig = {
              ...config,
              signal: abortController.signal,
            };
            abortController.abort();

            // don't do login redirect if it's calling logout api and the token expired
            if (config.url.indexOf(API_LOGOUT_ENDPOINT) === -1) {
              loginRedirect();
            }
            return abortConfig;
          } else {
            config.headers = {
              ...config.headers,
              Authorization: isTrue(process.env.NEXT_PUBLIC_ENABLE_APGIEE_TOKEN)
                ? `Bearer ${token.apigeeToken.access_token}`
                : `Bearer ${token.accessToken}`,
              'X-Authorization': `Bearer ${token.accessToken}`,
            };
          }
        }
      }
    }

    return config;
  });

  //to allow handle error globally, 3 types of errors: 1. string 2. Error object 3. AxiosError
  axios.interceptors.response.use(undefined, function (error: any) {
    let errorResp: Error;
    if (error.isAxiosError) {
      // error threw by axios
      errorResp = getAxiosError(error);
    } else {
      // error threw by manual
      errorResp = getOtherError(error);
    }
    //handle 403 error, means access denied, then go to home page
    if (errorResp.status === 403) {
      const goHome = () => (window.location.href = '/');

      notifier.notify(
        'Looks like you do not have permission to process the operation due to permission policies set by your admin manager. Please contact your admin manager to gain the required access.',
        {
          title: 'Oops! You don’t have permission',
          buttonText: 'Ok, got it!',
          onConfirm: goHome,
          onClose: goHome,
        }
      );
    }
    return Promise.reject(errorResp);
  });

  axios.defaults.paramsSerializer = {
    serialize: params => qs.stringify(cleanObject(params)),
  };
};

type Error = Partial<TError> & Partial<TApigeeError>;

const getOtherError = (error: any): Error => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  if (typeof error === 'string') {
    return { message: error, path };
  } else if (!error.message) {
    console.error(error);
    return { message: ERROR_GENERAL, path };
  } else {
    console.error(error);
    return error as Error;
  }
};

const getAxiosError = (error: AxiosError<Error>): Error => {
  let message: string | undefined;
  if (error.code === AxiosError.ERR_NETWORK) {
    message = ERROR_NETWORK;
  } else if (error.code === AxiosError.ETIMEDOUT || error.response?.status === 504) {
    message = ERROR_TIMEOUT;
  } else if (error.response) {
    message = error.response.data?.message ? error.response.data.message : ERROR_GENERAL;
    // overwrite messages for specific status code
    switch (error.response.status) {
      case 401:
        message = 'You are not authorized to access this resource!';
        break;
      case 403:
        message = "You don't have permission to access the resource!";
        break;
      case 404:
        message = 'The requested resource does not exist or has been deleted!';
        break;
      case 500:
        // Show user friendly message instead of "Internal Server Error"
        message = ERROR_GENERAL;
        break;
      default:
      // do nothing
    }
  } else if (!error.request) {
    // Something happened in setting up the request that triggered an Error
    message = ERROR_CLIENT;
  }
  return {
    code: error.code,
    status: error.response?.status,
    error: error.response?.data?.error || error.response?.data?.fault,
    message,
    path: error.config?.url,
    validationError: error.response?.data?.validationError,
    traceId: (error.config?.headers as any)?.[HEADER_TRACE_KEY]?.toString(),
    traceError: error.response?.data?.message || error.response?.data?.detail,
    timestamp: error.response?.data?.timestamp || new Date(),
  };
};

const ERROR_GENERAL = 'Something went wrong and request was not completed!';
const ERROR_NETWORK = 'Network error, please check your network connectivity and try again.';
const ERROR_TIMEOUT =
  'Looks like the server is taking too long to respond, system is still processing your request in the backend, please check the result in a while or try again later.';
const ERROR_CLIENT = 'Client error found, not able to create the http request, please refresh and try again';
