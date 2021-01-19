const Stream = require('node-rtsp-stream-jsmpeg')
const express = require('express');
const bodyParser =  require("body-parser");
const cors = require('cors');
const app = express();
const path = require('path')

// running rtsp streaming with socket io
const options = {
  name: 'streamName',
  url: 'rtsp://pccw:Sptelguest@2020!@61.16.96.19:554/Streaming/Channels/102',
  wsPort: 5500
}

stream = new Stream(options)
stream.start()

// this is for running the frontend html 
// localhost:5000/face to view the html
const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './weights')))
app.get('/', (req, res) => res.redirect('/face'))
app.get('/face', (req, res) => res.sendFile(path.join(viewsDir, 'face.html')))


app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

module.exports = app;
