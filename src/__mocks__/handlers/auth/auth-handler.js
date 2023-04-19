import { rest } from 'msw';
import { isTrue } from '@/helpers/utils';

const KEY_TOKEN = '_mock_token';

const API_MODULE_URL = process.env.NEXT_PUBLIC_API_HOST_UDF_TOKEN;

const generateToken = () => {
  const accessToken = btoa(new Date().toISOString());
  const refreshToken = btoa(String(new Date().getTime()));
  const expiryAt = new Date().getTime() + 30 * 60 * 1000; //in milliseconds, valid for 30min
  const apigeeToken = generateApigeeToken();
  const token = { accessToken, refreshToken, expiryAt, apigeeToken };
  localStorage.setItem(KEY_TOKEN, JSON.stringify(token));
  return token;
};

const generateApigeeToken = () => {
  const access_token = btoa(String(new Date().getFullYear()));
  return { access_token };
};

export const validateToken = (req) => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  let accessToken = req.headers.get('Authorization');
  if (accessToken) {
    accessToken = accessToken.substring(7);
    const tokenStr = localStorage.getItem(KEY_TOKEN);
    if (tokenStr) {
      const token = JSON.parse(tokenStr);
      const enabledToken = isTrue(process.env.NEXT_PUBLIC_ENABLE_APGIEE_TOKEN)
        ? token.apigeeToken.access_token
        : token.accessToken;
      if (enabledToken !== accessToken) {
        console.error('Invalid authorization token', 'Client->', accessToken, 'Server->', token.accessToken);
      }
      return enabledToken === accessToken;
    }
  }
  return false;
};

export const authHandlers = [
  /**username, password local login */
  rest.post(`${API_MODULE_URL}/api/v1/auth/token`, async (req, res, ctx) => {
    const { brn, email, serviceNo } = await req.json();
    console.log(brn, email, serviceNo);
    console.log(req);

    const token = generateToken();
    return res(ctx.delay(3000), ctx.status(200), ctx.json(token));

    // const users = JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
    // const user = users.find(item => item.loginId === username);

    // if (user?.password === password) {
    // this is temp
    // const dly = brn === 'test' ? 4000 : 1000;
    // const status = brn === 'test' ? 404 : 200;

    // const token = generateToken();
    // const random = Math.ceil(Math.random() * 10);
    // return random % 2 === 0
    //   ? res(ctx.delay(dly), ctx.status(200), ctx.json(token))
    //   : res(ctx.delay(dly), ctx.status(status), ctx.json(token));
    // } else {
    //   return res(
    //     ctx.status(400),
    //     ctx.json({
    //       message: 'Username or password is wrong',
    //     })
    //   );
    // }
  }),

  rest.get(`${API_MODULE_URL}/udfadmin/auth-udf/refreshtoken`, (req, res, ctx) => {
    let refreshToken = req.headers.get('Authorization');

    if (refreshToken) {
      refreshToken = refreshToken.substring(7);

      const tokenStr = localStorage.getItem(KEY_TOKEN);
      if (tokenStr) {
        const token = JSON.parse(tokenStr);
        if (token.refreshToken && token.refreshToken === refreshToken) {
          const token = generateToken();
          return res(ctx.status(200), ctx.json(token));
        }
      }

      const token = generateToken();
      return res(ctx.status(200), ctx.json(token));
    }
    return res(
      ctx.status(401),
      ctx.json({
        message: 'Unauthorized request',
      })
    );
  }),

  rest.get(`${API_MODULE_URL}/login/users/logout`, (req, res, ctx) => {
    if (validateToken(req)) {
      return res(ctx.status(200));
    }

    return res(
      ctx.status(401),
      ctx.json({
        message: 'Not authorized',
      })
    );
  }),
];
