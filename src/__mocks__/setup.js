import { BASE_PATH } from '@/helpers/constants'

// start up mock service for client
export const setupClientMocks = async () => {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./browser');
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${BASE_PATH}/mockServiceWorker.js`,
        options: {
          scope: '/',
        },
      },
    });

    /* NOTE turn on below for debugging */

    worker.printHandlers();

    // https://mswjs.io/docs/extensions/life-cycle-events
    // worker.events.on('request:start', req => {
    //   console.log('request:start => ', req.url.href);
    // });

    // worker.events.on('request:match', req => {
    //   console.log('request:match => ', req.url.href);
    // });

    // worker.events.on('request:unhandled', req => {
    //   console.log('request:unhandled => ', req.url.href);
    // });
  }
};

// start up mock service for server
export const setupServerMocks = async () => {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();

    /* NOTE turn on below for debugging */

    server.printHandlers();

    // https://mswjs.io/docs/extensions/life-cycle-events
    // server.events.on('request:start', req => {
    //   console.log('request:start => ', req.url.href);
    // });

    // server.events.on('request:match', req => {
    //   console.log('request:match => ', req.url.href);
    // });

    // server.events.on('request:unhandled', req => {
    //   console.log('request:unhandled => ', req.url.href);
    // });
  }
};
