'use strict';

require('dotenv').config();

module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: '/_dist_',
    'node_modules/@fortawesome/fontawesome-free/webfonts': { url: '/webfonts', static: true },
  },
  plugins: [
    '@snowpack/plugin-vue',
  ],
};
