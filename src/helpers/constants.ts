export const BASE_PATH = '/aurora';

//keys stored in session storage
export const LOCAL_STORAGE_KEY = {
  TOKEN_PAYLOAD: 'udf_token',
};

// http header key for the trace id
export const HEADER_TRACE_KEY = 'X-Correlation-Id';

export const API_MODULE_PATH = {
  auth: '/udfadmin',
};

export const ANONYMOUS_ACCESS_APIs = ['/api/v1/auth/token'];
