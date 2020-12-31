const fs = require('fs');
const bodyParser = require('body-parser');

module.exports.addApiRoutes = function(app) {
  app.use(bodyParser.json());

  let partners = null;
  app.get('/api/partners', (req, res) => {
    partners ||= fs.readFileSync('./data/partners.json', 'utf8');

    res.header('Content-Type', 'application/json');
    res.send(partners);
  });

  let settings = {
    lastCompletedDay: new Date(0),
  };
  app.get('/api/settings', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(settings);
  });
  app.post('/api/settings', (req, res) => {
    Object.assign(settings, req.body);
    res.header('Content-Type', 'application/json');
    res.send({});
  })
}
