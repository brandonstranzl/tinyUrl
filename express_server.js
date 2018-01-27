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
  "b2xVn2": { longUrl: "http://www.lighthouselabs.ca",
              userId: "000000"},
  "9sm5xK": { longUrl: "http://www.google.com",
              userId: "000111"}
};


function urlsForUser(id) {
var userUrls = [];
  for (var foo in urlDatabase) {
    var urlObject = urlDatabase[foo];
       urlObject['shortUrl'] = foo;
    if (urlDatabase[foo]["userId"] == id) {
    userUrls.push(urlObject);
    }
  }
  return (userUrls);
};

userUrls = [];
console.log(urlsForUser('000111'))

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
};

// gets:
app.get("/", (req, res) => {
  console.log(req.cookies);
  res.end("hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  if (!users[req.cookies["useridcookie"]]) {
    let templateVars = {
    userinfo: "",
    urlDatabase: urlDatabase,
    errorMessage: "",
    }
    res.render("urls_index", templateVars);
    }
  if (users[req.cookies["useridcookie"]]) {
    var userId = req.cookies["useridcookie"];
    var userUrls = [];
    console.log(urlsForUser(userId));
    console.log(req.cookies["useridcookie"]);
    let templateVars = {
    userinfo: users[userId],
    urlDatabase: urlDatabase,
    userUrls: urlsForUser(userId),
    errorMessage: "",
    };
    console.log(urlDatabase);
    res.render("urls_index", templateVars);
    }
  });

app.get("/login", (req, res) => {
  // if user is logged in, redirect him to /urls
  if (users[req.cookies["useridcookie"]]) {
    res.redirect('/urls');
  };
  if (!users[req.cookies["useridcookie"]]) {
    let templateVars = {
      errorMessage: "",
      errorMessage1: "",
    }
    res.render("login", templateVars);
  };
});

app.get("/register", (req, res) => {
  let templateVars = {
    userinfo: ""
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res, err) => {
  let errorMessage = "The username and password fields are required!";
  if (!req.body.email || !req.body.password) {
    res.status(400).send(errorMessage);
} else {
    var newUserId = generateRandomString();
    var email = req.body.email;
    var password = req.body.password;
    users[newUserId] = { id: newUserId, email: req.body.email, password: req.body.password };
    // res.cookie('useridcookie', newUserId);
    console.log(users);
    let templateVars = {
    errorMessage1: "",
    };
    res.render('login', templateVars);
  };
});

app.post("/login", (req, res) => {
  var errorMessage = "The username and password fields are required!";
  var username = req.body.email;
  var password = req.body.password;
  if (!username || !password) {
      // res.status(403);
      // res.send(errorMessage1);
      let templateVars = {
        errorMessage1: errorMessage,
      }
    res.render('login', templateVars);
  } else {
  for (var foo in users) {
    if ((users[foo]['email'] === username) && (users[foo]['password'] === password)) {
      res.cookie('useridcookie', users[foo]['id']);
      res.redirect('/urls');
      return;
      }
    }
  res.status(403);
  res.send("Password and usernames do not match");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('useridcookie');
  res.redirect("/urls");
});

// URLs:
// add a new URL:
app.get("/urls/new", (req, res) => {
if (!users[req.cookies["useridcookie"]]) {
  let templateVars = {
  errorMessage1: "You must be logged in to add a URL, please Login:",
  }
  res.render("login", templateVars);
  }
  else {
  let templateVars = {
  errorMessage: '',
  userinfo: users[req.cookies["useridcookie"]],
  };
  console.log(templateVars)
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  if (users[req.cookies["useridcookie"]]) {
    // var userinfo = (users[req.cookies["useridcookie"]]);
    let templateVars = {
    shortUrl: req.params.id,
    urlDatabase: urlDatabase,
    errorMessage: "",
    userinfo: users[req.cookies["useridcookie"]],
    }
      res.render("urls_show", templateVars);
  } else {
  if (!users[req.cookies["useridcookie"]]) {
    let templateVars = {
      userinfo: "",
      urlDatabase: urlDatabase,
      errorMessage: "You need to be regisered and logged in to modify the list of URLs",
      };
    res.render("urls_index", templateVars);
    };
  };
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  var userdata = users[req.cookies["useridcookie"]];
  // var userId = userdata;
  console.log(userdata);
  console.log(userdata.id);
  if (req.body.longUrl.length > 0) {
    var newShortUrl = generateRandomString();
    var longUrl = req.body.longUrl;
    var userId = userdata.id;
    urlDatabase[newShortUrl] = {longUrl: req.body.longUrl, userId: userdata.id}
    console.log(urlDatabase);

    // console.log(urlDatabase["shortUrl"]);
    // urlDatabase["shortUrl"]["longUrl"] = "req.body.longUrl";
    // urlDatabase["shortUrl"]["userId"] = "userinfo.id";
    res.redirect("/urls");
  } else {
    let templateVars = {
      // usernamecookie: req.cookies["usernamecookie"],
      errorMessage: "You must enter a URL below to add it 👾!",
      userinfo: users[req.cookies["useridcookie"]]
      }
      res.render("urls_new", templateVars);
    }
  });

app.post("/urls/:id", (req, res) => {
  let userinfo = users[req.cookies["useridcookie"]];
    if (urlDatabase[req.params.id]['userId'] === userinfo["id"]) {
    urlDatabase[req.params.id]['longUrl'] = req.body.longUrl;
    } else {
      res.status(403);
      res.send("You can only modify you OWN Urls newbie! 🐥");
    }
  let templateVars = {
  userinfo: users[req.cookies["useridcookie"]],
  urlDatabase: urlDatabase,
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  var userinfo = users[req.cookies["useridcookie"]];
  if (!users[req.cookies["useridcookie"]]) {
    res.status(403);
    res.send("Unauthorized");
    return;
  }
  console.log(urlDatabase)
  console.log(users);
  console.log(users[req.cookies["useridcookie"]]);
  console.log(userinfo);
  console.log(userinfo["id"])
  console.log(urlDatabase[req.params.id]['userId'])
  if (urlDatabase[req.params.id]['userId'] === userinfo["id"]) {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
    return;
    }
  else {
    res.status(403);
    res.send("You can only delete you own Urls!");
    }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  var letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o',
  'p','q','r','s','t','u','v','w','x','y','z'];
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
