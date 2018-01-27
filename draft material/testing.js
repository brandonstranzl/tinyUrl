var urlDatabase = {
  b2xVn2: { longUrl: 'http://www.lighthouselabs.ca', userId: '000000' },
  '9sm5xK': { longUrl: 'http://www.google.com', userId: '000111' },
  vqsvo733: { longUrl: 'www.buzzfeed.com', userId: 'ttxrt754' },
  znfan294: { longUrl: 'www.techcrunch.com', userId: 'ttxrt754' },
  baoiv200: { longUrl: 'www.medium.com', userId: 'ttxrt754' }
}

function urlsForUser(id) {
var userUrls = [];
  for (var foo in urlDatabase) {
    var urlObject = urlDatabase[foo];
       urlObject['shortUrl'] = foo;
    if (urlDatabase[foo]["userId"] == id) {
    userUrls.push(urlObject);
    }
  }
  console.log(userUrls);
  return (userUrls);
};

urlsForUser('ttxrt754');


// var userUrls = urlsForUser(userinfo.id);

// ***********************************************

// var objs = {
//   a: { val: 2 },
//   b: { val: 4 },
//   c: { val: 2 },
//   d: { val: 0 }
// };

// function getObjByVal(value) {
//   var objsFound = [];

//   for (var currObjKey in objs) {
//     if (objs[currObjKey].val === value) {
//       // THIS IS THE MISSING STEP
//       var urlObj = objs[currObjKey];
//       console.log(urlObj);
//       urlObj.shortId = currObjKey;
//       console.log(urlObj.shortId);
//       objsFound.push(urlObj);
//       console.log(objsFound);
//     }
//   }
//   return objsFound;
// }

// getObjByVal(2);

// var objs = {
//   a: { val: 2 },
//   b: { val: 4 },
//   c: { val: 2 },
//   d: { val: 0 }
// };

// function getObjByVal(value) {
//   var objsFound = [];

//   for (var currObjKey in objs) {
//     var currentUrlObj = objs[currObjKey];
//     console.log(currentUrlObj);
//     if (currentUrlObj.val === value) {
//       currentUrlObj.shortId = currObjKey;
//       objsFound.push(currentUrlObj);
//     }
//   }
//   console.log(objsFound);
//   return objsFound;
// }

// getObjByVal(2);
