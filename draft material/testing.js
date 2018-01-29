var urlDatabase = {
  b2xVn2: { longUrl: 'http://www.lighthouselabs.ca', userId: '000000' },
  '9sm5xK': { longUrl: 'http://www.google.com', userId: '000111' },
  vqsvo733: { longUrl: 'http://www.google.com', userId: '000111' },
  znfan294: { longUrl: 'http://www.google.com', userId: '000111' },
  baoiv200: { longUrl: 'www.medium.com', userId: 'ttxrt754' }
}

we wanted to mofidy this object - we have the long url and user id indexed by the short url.
but we wanted to see the long url and short url by user.  thus we needed to rearrange the sort.
so we took this object, and created a function do to this.  steps:
1. create new empty array. newArray.
2. create new empty object. newObject.
3. iterate over the object using for...in.
4. for key shortUrls in database, newObject = dataBase[key]...this creates an object for each key.
5. then, set a new key: value pair in the new object - first, for each key in urlDatabase, create newObject (unnamed)
into which you put the object at each key value.  so you have:
  newobject = {
    { longUrl: 'http://www.lighthouselabs.ca', userId: '000000' }
    { longUrl: 'http://www.google.com', userId: '000111' }
    { longUrl: 'www.medium.com', userId: 'ttxrt754' }
  }
Then, set new key: value pair - newObject.shortUrl = iterablekey of urlDatabase.  THIS SETS THE KEY OF URL DATABASE
AS THE VALUES OF THE KEY SHORTURL IN THE NEW OBJECT.  SO NEW OBJECT BECOMES:
  newobject = {
    { longUrl: 'http://www.lighthouselabs.ca', userId: '000000', shortUrl: 'b2xVn2' }
    { longUrl: 'http://www.google.com', userId: '000111', shortUrl: '9sm5xk' }
    { longUrl: 'www.medium.com', userId: 'ttxrt754', shortUrl: 'vqsco733' }
  }

Finally, we push these objects into our empty array:

    newArray.push(newobject) - BUT WE ONLY DO THIS FOR THE KEYS = to the row of the userID we want:
    if (urlDatabase[foo]["userId"] == id we want, for the iterable key in Urldatabase, push the
     new object in:
      newArray.push(urlObject)..

    so for each key in Urldatabase, we create an object that looks like this:
    { longUrl: 'www.medium.com', userId: 'ttxrt754', shortUrl: 'vqsco733' }
    then, for each key in urlDatabase, if the value of the userId for that key = the userId we want, we do this:
      take empty array - newArray[] - and push the newobject inside:
      newArray.push(urlObject)..

    this returns: - you can then iterate over this array - for..of - for iterable of newArray, return
    iterable.shortUrl and iterable.longUrl - that gives you the shortUrl and longUrl by user.

    Output:
 ttxrt754 =
  [ { longUrl: 'www.buzzfeed.com',
    userId: 'ttxrt754',
    shortUrl: 'vqsvo733' },
  { longUrl: 'www.techcrunch.com',
    userId: 'ttxrt754',
    shortUrl: 'znfan294' },
  { longUrl: 'www.medium.com',
    userId: 'ttxrt754',
    shortUrl: 'baoiv200' } ]




// //Using object:
// function urlsForUser(id) {
// var userUrls = {};
//   for (var foo in urlDatabase) {
//     var urlObject = urlDatabase[foo]; //add two existing fields in database to new object - longurl and userid
//        urlObject['shortUrl'] = foo; // adds third field to object  short url
//     if (urlDatabase[foo]["userId"] == id) {  // was pushing the object into the array called userUrls
//       userUrls[id] = { longUrl: urlObject['longUrl'], shortUrl: urlObject['shortUrl'],
//       userId: urlObject['userId'] }
//     }
//   }
//   console.log(userUrls);
//   return (userUrls);
// };

// urlsForUser('ttxrt754');
//

// Output:
//newArray called:
ttxrt754 =
  [ { longUrl: 'www.buzzfeed.com',
    userId: 'ttxrt754',
    shortUrl: 'vqsvo733' },
  { longUrl: 'www.techcrunch.com',
    userId: 'ttxrt754',
    shortUrl: 'znfan294' },
  { longUrl: 'www.medium.com',
    userId: 'ttxrt754',
    shortUrl: 'baoiv200' } ]




//Using array:
  function urlsForUser(id) {
  var userUrls = [];
    for (var foo in urlDatabase) {
      var urlObject = urlDatabase[foo];
         urlObject['shortUrl'] = foo;
      if (urlDatabase[foo]["userId"] == id) {
      userUrls.push(urlObject);
      }
    }
    // console.log(userUrls);
    console.log(userUrls);
    return (userUrls);
  };

// var urls = urlDatabase.map(function urlsForUser(id) {
//   return (id.shortUrl);
// })
// console.log(urls)

// console.log(urlDatabase.map(urlsForUser))

// var urls = userUrls.map(function (item) {
//   console.log(item.longUrl);
//   console.log(item.longUrl);
// })

// console.log(urls);

var userUrls = urlsForUser('ttxrt754');

userUrls.map(function (userUrls) {
  console.log(userUrls['longUrl'] +": " + userUrls['shortUrl']);
});

  [ { longUrl: 'www.buzzfeed.com',
    userId: 'ttxrt754',
    shortUrl: 'vqsvo733' },
  { longUrl: 'www.techcrunch.com',
    userId: 'ttxrt754',
    shortUrl: 'znfan294' },
  { longUrl: 'www.medium.com',
    userId: 'ttxrt754',
    shortUrl: 'baoiv200' } ]

// for (var item of urlsForUser('ttxrt754')) {
//   console.log(item['longUrl']);
//   console.log(item['shortUrl']);
// }



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
