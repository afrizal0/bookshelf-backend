const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const Init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.start();
  server.route(routes);
  console.log('Server running on %s', server.info.uri);
};

Init();
