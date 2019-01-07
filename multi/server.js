var http = require('http')

var game = { "1": {}, "2": {} }

http.createServer(function (req, res) {

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': req.headers.origin || true
  })
  const plr = JSON.parse(decodeURIComponent(req.url).split("/?")[1])
  game[plr.id] = plr.move
  console.log(game)
  res.end(JSON.stringify(game))

}).listen(8081)
