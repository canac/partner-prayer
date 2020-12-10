const app = require('express')();
const { addPartnersRoute } = require('./server/api.js');
addPartnersRoute(app);

module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  experiments: {
    app,
  },
  plugins: [
    '@snowpack/plugin-vue',
  ],
};
