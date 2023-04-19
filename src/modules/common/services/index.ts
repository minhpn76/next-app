import { QueryClient, useQuery } from '@tanstack/react-query';
import { LOCAL_STORAGE_KEY } from '@/helpers/constants';
import { tokenRefresh, logout } from './api';
import { Token } from '../types';

/**
 * This method will get a UDF token from local storage or refresh token if expired
 * @returns
 */
const acquireToken = async () => {
  let token: Token;
  try {
    token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN_PAYLOAD) || '{}');
    if (token.accessToken) {
      // minus 20 seconds for network latency
      // if (new Date(token.expiryAt - 20 * 1000) > new Date()) {
      return token;
      // }
      // console.log('token expired, requesting a new token', 'expired at', new Date(token.expiryAt));
      // return refreshToken('');
    } else {
      return null;
    }
  } catch {
    // in case token modified by human
    return null;
  }
};

// get a new access_token by refresh_token
export const refreshToken = async (refreshToken: string) => {
  try {
    const token = await tokenRefresh(refreshToken);
    localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN_PAYLOAD, JSON.stringify(token));
    return token;
  } catch {
    //  refresh token not valid or expired
    return null;
  }
};

export const getUdfToken = acquireToken;

export const useUdfToken = () => useQuery(['useUdfToken'], getUdfToken);

export const checkUdfToken = async () => {
  const token = await acquireToken();
  if (!token) throw new Error('Not authenticated');
};

export const doLogout = async (queryClient: QueryClient) => {
  try {
    // logout from server
    await logout();
  } finally {
    queryClient.clear();
    localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN_PAYLOAD);
  }
};
