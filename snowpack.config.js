const app = require('express')();
const { addPartnersRoute } = require('./server/api.js');
addPartnersRoute(app);

module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: '/_dist_',
    'node_modules/@fortawesome/fontawesome-free/webfonts': { url: '/webfonts', static: true },
  },
  experiments: {
    app,
  },
  plugins: [
    '@snowpack/plugin-vue',
  ],
};
