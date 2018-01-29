var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
// app.use(cookieParser(('my_super_secret_key')))
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['my_super_secret_key'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// database of Urls:
var urlDatabase = {
  "b2xVn2": { longUrl: "http://www.lighthouselabs.ca",
              userId: "000000"},
  "9sm5xK": { longUrl: "http://www.google.com",
              userId: "000111"}
};

// callback function for database of urls to associate a url with a user and create userUrl database:
var urlsForUser = function (id) {
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

//test that callback funtion works:
console.log(urlsForUser('000111'))

// database of users:
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
  if (users[req.session["useridcookie"]]) {
  res.redirect("/urls");
  }
  if (!users[req.session["useridcookie"]]) {
  res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  if (!users[req.session["useridcookie"]]) {
    let templateVars = {
    userinfo: "",
    userUrls: [],
    errorMessage: "",
    }
    res.render("urls_index", templateVars);
    }
  if (users[req.session["useridcookie"]]) {
    var userId = req.session["useridcookie"];
    var userUrls = urlsForUser(userId);
    let templateVars = {
    userinfo: users[userId],
    userUrls: userUrls,
    errorMessage: "",
    };
    res.render("urls_index", templateVars);
    }
  });

app.get("/login", (req, res) => {
  if (users[req.session["useridcookie"]]) {
    res.redirect('/urls');
  };
  if (!users[req.session["useridcookie"]]) {
    let templateVars = {
      errorMessage: "",
      errorMessage1: "",
    }
    res.render("login", templateVars);
  };
});

app.get("/register", (req, res) => {
  if (!users[req.session["useridcookie"]]) {
    let templateVars = {
      userinfo: ""
    };
  res.render("register", templateVars)
  }
  if (users[req.session["useridcookie"]]) {
    var userId = req.session["useridcookie"];
    var userUrls = urlsForUser(userId);
    let templateVars = {
      userinfo: users[userId],
      userUrls: userUrls,
      errorMessage: "You are already registered my good friend!👍",
    };
  res.render("urls_index", templateVars);
  }
});

app.post("/register", (req, res, err) => {
  let errorMessage = "The username and password fields are required!";
  if (!req.body.email || !req.body.password) {
    res.status(400).send(errorMessage);
    } else {
    var newUserId = generateRandomString();
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = bcrypt.hashSync(password, 10);
    users[newUserId] = { id: newUserId, email: req.body.email, password: hashedPassword };
    console.log(users);
    let templateVars = {
    errorMessage1: "",
    };
    res.render('login', templateVars);
    }
  });

app.post("/login", (req, res) => {
  var errorMessage = "The username and password fields are required!";
  var username = req.body.email;
  var password = req.body.password;
  if (!username || !password) {
      let templateVars = {
        errorMessage1: errorMessage,
      }
    res.render('login', templateVars);
  } else {
  for (var userId in users) {
    var hashedPassword = users[userId]['password']
    console.log(users[userId]['password']);
    if ((users[userId]['email'] === username) && (bcrypt.compareSync(password, hashedPassword))) {
      req.session['useridcookie'] = users[userId]['id'];
      res.redirect('/urls');
      return;
      }
    }
  res.status(403);
  res.send("Password and usernames do not match.");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
if (!users[req.session["useridcookie"]]) {
  let templateVars = {
  errorMessage1: "You must be logged in to add a URL, please Login:",
  }
  res.render("login", templateVars);
  }
  else {
  let templateVars = {
  errorMessage: '',
  userinfo: users[req.session["useridcookie"]],
  };
  console.log(templateVars)
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  var userId = req.session["useridcookie"];
  var userUrls = urlsForUser(userId);
  console.log(userId);
  console.log((urlDatabase[req.params.id]['userId']));
  if (users[req.session["useridcookie"]]) {
    if (urlDatabase[req.params.id]['userId'] === userId) {
      let templateVars = {
        shortUrl: req.params.id,
        urlDatabase: urlDatabase,
        errorMessage: "",
        userinfo: users[req.session["useridcookie"]],
      }
    res.render("urls_show", templateVars);
    }
  };
  if (users[req.session["useridcookie"]]) {
    if (urlDatabase[req.params.id]['userId'] !== userId) {
      let templateVars = {
        userinfo: users[userId],
        userId: userId,
        userUrls: userUrls,
        errorMessage: "You can only modify URLs that belong to you newbie 😂",
      }
    res.render("urls_index", templateVars);
    }
  };
  if (!users[req.session["useridcookie"]]) {
    let templateVars = {
      userinfo: "",
      urlDatabase: urlDatabase,
      userUrls: [],
      errorMessage: "You need to be regisered and logged in to modify your list of URLs",
      };
    res.render("urls_index", templateVars);
  };
});

app.get("/u/:shortUrl", (req, res) => {
  var match;
  for (var shortUrl in urlDatabase) {
    if (req.params.shortUrl === shortUrl) {
      match = true;
    };
  }
  if (match === true) {
    let longUrl = urlDatabase[req.params.shortUrl]['longUrl'];
    res.redirect(longUrl);
  } else {
    res.send("That shortUrl doesn't exist!!🤢");
  }
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  var userId = req.session["useridcookie"];
  var userUrls = {};
  console.log(userId);
  if (req.body.longUrl.length > 0) {
    var newShortUrl = generateRandomString();
    if (!req.body.longUrl.startsWith('http:')) {
    var longUrl = 'http://'+req.body.longUrl;
    } else {
      longUrl = req.body.longUrl
    };
    urlDatabase[newShortUrl] = {longUrl: longUrl, shortUrl: newShortUrl, userId: userId};
    console.log(urlDatabase);
    res.redirect("/urls/"); //PLEASE NOTEL I HAVE PURPOSELY CHOSEN TO NOT APPEND + newShortUrl) TO THIS LINE OF CODE.
      // APPENDING + newShortUrl is just a basd user experience.  You should be able to create your list of Urls.
      // and as you add them, see the total list.  the + newShortUrl would take you to the edit page, which is
      //accessible from the edit button on the /urls page.  Thus, I am aware this is out of spec.
  } else {
    let templateVars = {
      errorMessage: "You must enter a URL below to add it 👾!",
      userId: req.session["useridcookie"]
      }
      res.render("urls_new", templateVars);
    }
  });

app.post("/urls/:id", (req, res) => {
  let userinfo = users[req.session["useridcookie"]];
    if (urlDatabase[req.params.id]['userId'] === userinfo["id"]) {
    urlDatabase[req.params.id]['longUrl'] = req.body.longUrl;
    } else {
      res.status(403);
      res.send("You can only modify you OWN Urls newbie! 🐥");
    }
  let templateVars = {
  userinfo: users[req.session["useridcookie"]],
  urlDatabase: urlDatabase,
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  var userinfo = users[req.session["useridcookie"]];
  if (!users[req.session["useridcookie"]]) {
    res.status(403);
    res.send("Unauthorized");
    return;
  }
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
