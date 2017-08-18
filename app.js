const express = require('express');
const session = require('express-session');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");



app.listen('3000' function(){
  console.log('Node.js totally rule!!');
});
