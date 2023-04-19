import axios from 'axios';
import { API_LOGOUT_ENDPOINT } from '../constants';
import { Token } from '../types';

// UDF api to exchange a new access_token with refresh_token
export const tokenRefresh = (refreshToken: string) => {
  return axios
    .get<Token>(`/udfadmin/auth-udf/refreshtoken`, {
      headers: { Authorization: `Bearer ${refreshToken}` },
      baseURL: process.env.NEXT_PUBLIC_API_HOST_UDF_TOKEN,
    })
    .then(resp => resp.data);
};

export const marketLogin = (brn: string, email: string, serviceNo: string) => {
  return axios.post<Token>(`/api/v1/auth/token`, { brn, email, serviceNo }).then(resp => resp.data);
};

export const marketAutoLogin = ({ userToken }: { userToken: string }) => {
  return axios
    .post<Token>(
      `/api/v1/auth/token`,
      { userToken },
      {
        baseURL: process.env.NEXT_PUBLIC_API_HOST_UDF_TOKEN,
      }
    )
    .then(resp => resp.data);
};

// logout user from server
export const logout = () => {
  axios.get(API_LOGOUT_ENDPOINT);
};
