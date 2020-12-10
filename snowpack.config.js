const app = require('express')();

app.get('/api/partners', (req, res) => {
  res.json(require('./data/partners.json'));
});

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
