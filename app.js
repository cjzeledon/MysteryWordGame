// NOTE: STARTING LINE ---------------- DO NOT MESS WITH IT --------------------

const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
// const words = (fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n"));
const words = ["vaccum", "television", "cat", "dog", "kindle", "amazon",
"shark", "lightning", "lost", "savannah", "america", "bean", "purse", "door",
"international", "communication", "square", "rectangle", "diamond", "circle", "triangle",
"oval", "legacy", "supernatural", "ignorance", "human", "measurement", "constant",
"insistence", "triplet", "omnipotent", "invasion", "fashionista", "indifferent",
"multicolor", "burgundy", "teal"]

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


// If the session is not defined, it will set all the later session variables equal to previous functions that does all the work for it.
app.get('/', function(request, respond){
  if(request.session.RandomWord === undefined) {
    request.session.RandomWord = SelectWordRandom();
    request.session.HiddenAnswer = SecretWordAnswer(request);
    request.session.BlankUnderscores = SecretWordBlanks(request);
    request.session.NumberofGuesses = 8;
    request.session.AlreadyFreakinGuessed = [ ];
  }

  // renders the mustache page to html format
  respond.render('index', {
    DropWord: {
      Hint: request.session.BlankUnderscores,
    }
  });
});

app.post ('/', function(request, respond){
  // check the word by looping over every letter
  let GuessALetter = request.body.GiveMeALetter;
  let goodGuess = false;
  let Sameness = false;
  let gameOver = false;

  // console.log(GuessALetter);
  // console.log(request.session.HiddenAnswer);
  // console.log(request.session.BlankUnderscores);
  // console.log(request.session.RandomWord);
  // console.log(request.session.HiddenAnswer.length);

  for (let i = 0; i < request.session.AlreadyFreakinGuessed.length; i++){
    if (request.session.AlreadyFreakinGuessed[i] === GuessALetter){
      Sameness = true;
    }
  }
  console.log(Sameness);

 //When a letter is correct, it will replace the underscore letter with actual letter.
  for (let i = 0; i < request.session.RandomWord.length; i++){
    if (request.session.HiddenAnswer[i] === GuessALetter){
      request.session.BlankUnderscores[i] = (GuessALetter);
      goodGuess = true;
    }
  };


  if (goodGuess === false) {
    request.session.NumberofGuesses--;
  }

  //if the boolean is false, it will only add letter once.
  if (Sameness === false){
    request.session.AlreadyFreakinGuessed.unshift(GuessALetter);
  };

  //If the number of guesses are down to 0, it is game over and the user will be given the answer that they failed to guess.
  if (request.session.NumberofGuesses === 0) {
    gameOver = true;
    request.session.BlankUnderscores = [];
  }

  // Renders the information to mustsache page.
  respond.render('index', {
    DropWord: {
      Hint: request.session.BlankUnderscores,
      LettersAlreadyGuessed: request.session.AlreadyFreakinGuessed,
      guessCountdown: request.session.NumberofGuesses,
      samenessAGAIN: Sameness,
      Answer: request.session.RandomWord,
      gameOver: gameOver
    }
  })
});

// app.get('/signup', function(request, respond){
//   respond.render('signup');
// })
//
// app.get('/login', function(request, respond){
//   respond.render('login');
// })


// app.listen(3000, function(){
//   console.log('Node.js totally rule!!')
// });
//
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
