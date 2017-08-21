// NOTE: STARTING LINE ---------------- DO NOT MESS WITH IT --------------------
const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const words = (fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n"));
app.engine('mustache', mustacheExpress());
app.set ('views', './views');
app.set ('view engine', 'mustache');
app.use(session({
  secret: 'lkefiencj_48_dudnfg',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views"));
// NOTE: ENDING LINE ---------------- DO NOT MESS WITH IT --------------------

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
  if (request.session.RandomWord === undefined) {
    request.session.RandomWord = SelectWordRandom();
    request.session.HiddenAnswer = SecretWordAnswer(request);
    request.session.BlankUnderscores = SecretWordBlanks(request);
  }

  console.log(request.session.RandomWord);

  respond.render('index', {
    DropWord: {
      Hint: request.session.BlankUnderscores,
    }
  });
});

app.post ('/', function(request, respond){
  // check the word by looping over every letter
  const GuessALetter = request.body.GiveMeALetter;
  const wrongLetter = [];

  console.log(GuessALetter);
  console.log(request.session.HiddenAnswer);
  console.log(request.session.BlankUnderscores);
  console.log(request.session.RandomWord);

  for (let i = 0; i < request.session.RandomWord.length; i++){
    if (request.session.HiddenAnswer[i] === GuessALetter){
      request.session.BlankUnderscores[i] = (GuessALetter);
    }
  //  wrongLetter.push(GuessALetter);
  }

// Since this is a boolean, use the idea that if it does equal to that value, somehow find a way to ignore it. If it does NOT equal to it, then add it to the list of incorrect letters but only once if needed.
  // for (let i = 0; i <request.session.RandomWord.length; i++){
  //   if (request.session.HiddenAnswer[i] !== GuessALetter){
  //     break;
  //   } else {
  //       wrongLetter.push(GuessALetter);
  //     }
  //   // use the += to add in a letter and NOT replace it!
  // }

  for (let i = 0; i <request.session.RandomWord.length; i++){
    if (request.session.HiddenAnswer[i] !== GuessALetter){
      wrongLetter.push(GuessALetter);
      break;
      }
    // use the += to add in a letter and NOT replace it!
  }

  respond.render('index', {
    DropWord: {
      Hint: request.session.BlankUnderscores,
      IncorrectLetters: wrongLetter,
    }
  });
});


app.listen(3000, function(){
  console.log('Node.js totally rule!!')
});
