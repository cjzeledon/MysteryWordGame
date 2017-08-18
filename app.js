const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.engine('mustache', mustacheExpress());
app.set ('views', './views');
app.set ('view engine', 'mustache');

app.get('/', function(req, res){
  res.render('index');
});

app.listen(3000, function(){
  console.log('Node.js totally rule!!')
});
