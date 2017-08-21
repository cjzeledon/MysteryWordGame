const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const words = (fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n"));
// const random = words[Math.floor(Math.random() * words.length) | 0];
// const leakWord = [];

// const example = ['cat', 'dog', 'horse', 'flea', 'mite', 'shark', 'fish', 'seahorse', 'graywolf'];

// NOTE:  [ ] is an array and { } is an object

app.engine('mustache', mustacheExpress());
app.set ('views', './views');
app.set ('view engine', 'mustache');
app.use(session({
  secret: 'lkefiencj_48_dudnfg',
  resave: false,
  saveUninitialized: true
}));

// returns a random word
function SelectWordRandom() {
  const strayWord = words[Math.floor(Math.random() * words.length) | 0];
  return strayWord;
}

// reads RandomWord from session and builds an array from that word.
function SecretWordAnswer (request) {
  const leakWord = []; // this is where the answer is
  for (let i = 0; i < request.session.RandomWord.length; i++){
    leakWord.push(request.session.RandomWord.charAt(i))
  };
  return leakWord;
}

// builds an array of underscores for each letter in HiddenAnswer
function SecretWordBlanks(request) {
  const underscore = []; // this starts out as blanks
  for (let i =0; i < request.session.HiddenAnswer.length; i++){
    underscore.push("_");
  };
  return underscore;
}


app.get('/', function(request, respond){
  // The function SelectWordRandom will randomly select a word from the massive list of computer words it has in store.

  if (request.session.RandomWord === undefined) {
    request.session.RandomWord = SelectWordRandom();
    request.session.HiddenAnswer = SecretWordAnswer(request);
    request.session.BlankUnderscores = SecretWordBlanks(request);
  }

  // function RandomWord(){
  //   const random = words[Math.floor(Math.random() * words.length) | 0];
  //   const leakWord = []; // this is where the answer is
  //   const underscore = []; // this starts out as blanks
  //
  //   for (let i = 0; i < random.length; i++){
  //     leakWord.push (random.charAt(i))
  //   };
  //
  //   for (let i =0; i < leakWord.length; i++){
  //     underscore.push("_");
  //   }
  //   console.log(underscore);
  //   return underscore;
  // };
  //
  respond.render('index', {
    DropWord: {
      Hint: request.session.BlankUnderscores
    }
  });
  // ------------------------END ---------------------

});

app.post ('/', function(request, respond){
  // check the word by looping over every letter
  // const DropWord = request.body.mysteryWord;
  // const GuessLetter = request.body.mysteryWord;

  // respond.render('index');
  // for (i = 0; i < request.session.RandomWord; i++){
  //   if (request.session.RandomWord[i] === )
  // }
  //
  // respond.render('index', {
  //   GuessLetter: request.session.WHATEVER;
  //   }
  // });
});







app.listen(3000, function(){
  console.log('Node.js totally rule!!')
});
