require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
// Basic Configuration
const port = process.env.PORT || 8001;
const fs = require('fs');
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', function (req, res) {
  var regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
  var url = req.body.url
  console.log(req.body)
  if (regex.test(url)){
    fs.readFile('./data.json', 'utf8', (err, data) => {
      var data = JSON.parse(data)
      var short = data.last +1
      data.last = short
      data.urls[short] = url
      fs.writeFile('./data.json', JSON.stringify(data), err => {
        res.json({
          original_url: url,
          short_url: short
        })
      });
    });
  }
  else {
    res.json({ error: 'invalid url' })
  }
})
app.get('/api/shorturl/:url', function (req, res) {
  var {url} = req.params
  fs.readFile('./data.json', 'utf8', (err, data) => {
    data = JSON.parse(data)
    if (data.urls[url] == undefined) {
      res.json({ error: 'invalid url' })
    }
    else {
      res.redirect(data.urls[url])
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
