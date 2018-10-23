const http = require('http')
const chalk = require('chalk')
const path = require('path')


const conf = require('./config')
const _route = require('./util/_route')

/* 01
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.write('<html>')
  res.write('<body>')
  res.write('hello http~~')
  res.write('</body>') 
  res.end('</html>')
})
*/

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url)
  _route(req, res, filePath)
})

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`
  console.log(`server running at port ${chalk.green(addr)}`)
})