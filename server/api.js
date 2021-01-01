require('dotenv').config();

const fs = require('fs');
const bodyParser = require('body-parser');

const { getDb } = require('./db.js');

module.exports.addApiRoutes = function(app) {
  app.use(bodyParser.json());

  let partners = null;
  app.get('/api/partners', (req, res) => {
    partners ||= fs.readFileSync('./data/partners.json', 'utf8');

    res.header('Content-Type', 'application/json');
    res.send(partners);
  });

  app.get('/api/settings', async (req, res) => {
    const settings = {};

    const db = await getDb();

    const lastCompletedDayDoc = await db.collection('settings').findOne();
    settings.lastCompletedDay = lastCompletedDayDoc?.lastCompletedDay || new Date(0);

    settings.skippedDays = {};
    for await (const doc of db.collection('skippedDays').find()) {
      settings.skippedDays[doc.date.toISOString()] = doc.isSkipped;
    }

    res.header('Content-Type', 'application/json');
    res.send(settings);
  });
  app.post('/api/settings', async (req, res) => {
    const newSettings = req.body;

    const db = await getDb();

    if (newSettings.lastCompletedDay) {
      const lastCompletedDay = new Date(newSettings.lastCompletedDay)
      await db.collection('settings').updateOne({}, { $set: { lastCompletedDay } }, { upsert: true });
    }

    if (newSettings.skippedDays) {
      for (const [date, isSkipped] of Object.entries(newSettings.skippedDays)) {
        await db.collection('skippedDays').updateOne({ date: new Date(date) }, { $set: { isSkipped } }, { upsert: true });
      }
    }

    res.header('Content-Type', 'application/json');
    res.send({});
  })
}
