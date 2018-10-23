const fs = require('fs')
const path = require('path')
const artTemplate = require('art-template')


const promisify = require('util').promisify //解决回调地狱
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

const _config = require('../config')

const viewPath = path.join(__dirname, '../views/index.html')
const source = fs.readFileSync(viewPath)
const template = artTemplate.compile(source.toString())



module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      fs.createReadStream(filePath).pipe(res)
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      const dir = path.relative( _config.root,filePath)
      const data = {
        files,
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : ''
      }

      console.log('===d.dir====',data.dir);
      
      res.end(template(data))
    }
  } catch (ex) {
    console.error(ex)
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${filePath} is not a director or file \n ${ex.toString()}`)
  }
}