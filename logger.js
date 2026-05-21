import http from 'http';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    console.log("=== ERROR RECEIVED ===");
    console.log(body);
    console.log("======================");
    res.end('ok');
  });
});

server.listen(9999, () => {
  console.log('Listening on 9999');
});
