/*const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: '180.230.174.144:8000',
      changeOrigin: true,
    })
  );
  app.use(
    '/mongodb',
    createProxyMiddleware({
      target: 'http://localhost:27017',
      changeOrigin: true,
    })
  );
};
*/