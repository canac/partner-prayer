const fs = require('fs');

module.exports.addPartnersRoute = function(app) {
  let partners = null;
  app.get('/api/partners', (req, res) => {
    partners ||= fs.readFileSync('./data/partners.json', 'utf8');

    res.header('Content-Type', 'application/json');
    res.send(partners);
  });
}
