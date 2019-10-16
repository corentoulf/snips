// Instantiate library (can be global or instantiated in separate places-- either way is fine)
var DZ = require('node-deezer');
var deezer = new DZ();

// Now use node-deezer to generate the the link where you can redirect
// your users to allow your app to access her/his Deezer account
var appId = '374644'; // from developers.deezer.com
var appSecret = 'b6b614771738ce955b908162cfa95d03'; // from developers.deezer.com
var redirectUrl = 'http://localhost:3000/deezerCallback'; // somewhere in your app, see below
var loginUrl = deezer.getLoginUrl(appId, redirectUrl);

// ...
// ...
// ...
// When the user has approved your app, they're sent to the redirectUrl above
// which you might handle like so:

// `code` should have been handed back by Deezer as a parameter
// if it was not, an error occurred, and we must handle it here
var code = req.param('code');

if (!code) {
  // Handle an error if one happened (see express example for more on this)
  // we'll gloss over it here
  var err = req.param('error_reason');

  // Since we have this code, we can trust that the user 
  // actually meant to grant us access to their account.
	
  // Now we need to combine this code with our app credentials 
  // to prove to Deezer that we're a valid app-- if everything works,
  // we'll get an `access_token` we can use to represent the user
  // for a period of time (or "forever" if we have the offline_access permission)
  deezer.createSession(appId, appSecret, code, function (err, result) {
		
    // If an error occurs, we should handle it
    // (again, see express example for more)
  
    // Otherwise, everything is cool and we have the access token and lifespan (`expires`)
    // in `result.accessToken` and `result.expires`
    console.log(result);
    
    // Now we can do API requests!
    
    // e.g. search for artists with names containing the phrase 'empire'
    deezer.request(result.accessToken,
    {
      resource: 'search/artist',
      method: 'get',
      fields: { q: 'empire' }
    },
    function done (err, results) {
      if (err) throw err;
      console.log(results);
    });
    
  });
}