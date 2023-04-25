import { useMutation } from '@tanstack/react-query';
import { LOCAL_STORAGE_KEY } from '@/helpers/constants';
import { marketAutoLogin, marketLogin } from '@/modules/common/services/api';

export const useSignIn = () =>
  useMutation(
    ({ brn, email, serviceNo }: { brn: string; email: string; serviceNo: string }) =>
      marketLogin(brn, email, serviceNo),
    {
      onSuccess: data => {
        // save in cookies
        // document.cookie = `${LOCAL_STORAGE_KEY.TOKEN_PAYLOAD}=${JSON.stringify(data)}; expires=${new Date(
        //   Date.now() + 86400000
        // ).toUTCString()}; path=/`;
        localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN_PAYLOAD, JSON.stringify(data));
      },
    }
  );

export const useAutoSignIn = () =>
  useMutation(({ userToken }: { userToken: string }) => marketAutoLogin({ userToken }), {
    onSuccess: data => {
      localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN_PAYLOAD, JSON.stringify(data));
    },
  });
