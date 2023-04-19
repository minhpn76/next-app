import CryptoJS from 'crypto-js';
import { NextRouter } from 'next/router';
import { BASE_PATH, LOCAL_STORAGE_KEY } from './constants';

export const isTrue = (value?: string | number) => {
  return (typeof value === 'string' && value?.toUpperCase() === 'TRUE') || value === 1;
};

/**
 * Utilities to remove keys with value is undefined, null or empty
 * Useful for clearing parameter objects, to not display empty parameters in the url
 */
export const cleanObject = (object?: Record<string, any>) => {
  if (!object) return {};
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (value === undefined || value === null || value === '') {
      delete object[key];
    }
  });
  return object;
};

/*
 * This utils will encrypt the given data and save it in local storage
 * @Methods -
 *  setItems(key:string, data:string)
 *  getItems(key:string)
 */
export const secureLocalStorage = {
  getItem: (key: string) => {
    const cipher = localStorage.getItem(key) || '';
    const bytes = CryptoJS.AES.decrypt(cipher, process.env.NEXT_PUBLIC_SALT || '');
    return bytes.toString(CryptoJS.enc.Utf8);
  },
  setItem: (key: string, data: string) => {
    localStorage.setItem(key, CryptoJS.AES.encrypt(data, process.env.NEXT_PUBLIC_SALT || '').toString());
  },
};

/*
 * Ignore operators that handled by imperva for sql injection
 */
export const sanitizeUserSearchText = (search: string) => {
  const value = search.trim();

  // 1. single quote: if only one and it's at the last place, Imperva consider it's sql injection
  if (value.split("'").length === 2 && value.substring(value.length - 1) === "'") {
    return search.replace("'", '');
  }
  return search;
};

export const loginRedirect = (router?: NextRouter) => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN_PAYLOAD);
  if (router) {
    router.push('/market/login/sso');
  } else {
    window.location.href = BASE_PATH + '/market/login/sso';
  }
};

export const formatOfferDescription = (description: string): string[] => {
  return description.split('\n');
};

export function paginate<T>(array: T[], pageSize: number, pageIndex: number) {
  return array.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
}
