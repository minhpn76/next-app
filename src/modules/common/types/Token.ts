export type Token = {
  tokenType?: string;
  accessToken?: string;
  refreshToken?: string;
  expiryAt?: number;
  apigeeToken: { access_token: string };
};
