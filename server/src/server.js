const express = require('express');
const https = require('https');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')

require('dotenv').config();

const app = express();

const {
  HTTP_PORT = 8080,
  HTTPS_PORT = 1337,
} = process.env;

morgan.token('protocol', (req) => {
  return req.secure ? 'https' : 'http ';
});

app.use(morgan('[:protocol] ":method :url HTTP/:http-version" :status :res[content-length] :res[content-type]'));

app.use(bodyParser.json());

app.get('/text', (req, res) => {
  res.send('text got back');
})

const methods = ['post', 'get', 'put', 'delete', 'patch'];
methods.forEach(m => {
  app[m](`/${m}`, (req, res) => {
    res.json({
      method: m,
      body: req.body,
      ok: true
    });
  })
})

app.post('/delayed', async (req, res) => {
  const delay = req.body.delay;

  await new Promise(resolve => setTimeout(resolve, delay));

  res.json({ ok: true })
});

app.get('/content-type', (req, res) => {
  if (req.headers["content-type"] === 'application/vnd+custom') {
    res.setHeader('content-type', 'application/json');
    return res.json({ ok: true });
  }

  res.setHeader('content-type', 'text/plain');
  return res.send('text')
});

app.get('/random', (req, res) => {
  res.json({ ok: true, number: Math.random() });
})

app.use('/', express.static(path.join(__dirname, '..', 'static')))

const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'server.cert')),
}, app);

const httpServer = app;

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`Running https server on ${HTTPS_PORT}`);
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`Running http server on ${HTTP_PORT}`);
});
