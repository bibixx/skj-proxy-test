const http = require('http');
const url = require('url');

http.createServer(onRequest).listen(2137, () => console.log(`Listening on 2137`));

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  const parsedUrl = url.parse(client_req.url);

  console.log(parsedUrl);

  const options = {
    hostname: 'google.com',
    port: 443,
    // hostname: client_req.hostname,
    // port: 8080,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers
  };

  const proxy = http.request(options, function (res) {
    console.log(1);
    client_res.writeHead(res.statusCode, res.headers);

    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
