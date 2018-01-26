var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// databases:
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// variables:
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// gets:
app.get("/", (req, res) => {
  console.log(req.cookies);
  res.end("hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
 // var key = req.body.key;
 // var urls = urlDatabase;
  let templateVars = {
    userinfo: JSON.stringify(users[req.cookies["useridcookie"]]),
    urls: urlDatabase//[key]
  };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  // if user is logged in, redirect him to /urls
  res.render("urls_login", {useridcookie: ''});
});

app.get("/register", (req, res) => {
  let templateVars = {
    userinfo:"",
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res, err) => {
    if (!req.body.email || !req.body.password) {
      let errorMessage = "The username and password fields are required!"
      res.status(400);
      res.send(errorMessage);
      // res.render("/register")
    } else {
    // add user to database
    var newUserId = generateRandomString();
    var email = req.body.email;
    var password = req.body.password;
    users[newUserId] = { id: newUserId, email: req.body.email, password: req.body.password };
    res.cookie('useridcookie', newUserId);
    console.log(users);
    res.redirect('/urls');
    }
  });

app.get("/urls/new", (req, res) => {
  var key = req.body.key;
  var urls = urlDatabase;
  let templateVars = {
    usernamecookie: req.cookies["usernamecookie"],
    errorMessage: '',
    userinfo: JSON.stringify(users[req.cookies["useridcookie"]]),
    urls: urlDatabase[key]
    };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  if (req.body.longURL.length > 0) {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect("/urls");
  } else {
    let templateVars = {
      usernamecookie: req.cookies["usernamecookie"],
      errorMessage: "The longURL field is required!"
    }
    res.render("urls_new", templateVars)
  }
});


app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    usernamecookie: req.cookies["usernamecookie"],
    userinfo: JSON.stringify(users[req.cookies["useridcookie"]]),
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

// posts:


app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let errorMessage = "The username and password fields are required!"
    if ((req.body.email && req.body.password) !== undefined) {
      for (var user in users) {
        if ((req.body.email === user.email) && (req.body.password === user.password)) {
        // check if the email matches && password matches
        res.cookie('useridcookie', user.id);
        res.redirect("/urls");
      }
      res.status(403);
      res.send("Password and usernames to not matches");
      }
      if ((req.body.email && req.body.password) == undefined) {
      res.status(403);
      res.send(errorMessage);
    }
  }
});
    //
    // for (var user in users) {
    //   if ((user.email === req.body.email) && (user.password === req.body.password)) {
    //   res.cookie('useridcookie', user.id);
    //   res.redirect("/urls");
    //   }
    //   if ((user.email === req.body.email) && (user.password !== req.body.password)) {
    //   res.status(403);
    //   res.send(errorMessage);
    //   };
    //   if ((user.email !== req.body.email) && (user.password === req.body.password)) {
    //   res.status(403);
    //   res.send(errorMessage);
    //   };
    // }

app.post("/logout", (req, res) => {
  res.clearCookie('useridcookie');
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  var letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  var numbers = [0,1,2,3,4,5,6,7,8,9];
  var randomstring = '';

  for(var i=0;i<5;i++){
  var rlet = Math.floor(Math.random()*letters.length);
  randomstring += letters[rlet];
  }
  for(var i=0;i<3;i++){
  var rnum = Math.floor(Math.random()*numbers.length);
  randomstring += numbers[rnum];
  };
  return (randomstring);
}
