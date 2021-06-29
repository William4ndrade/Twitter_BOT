# Twitter_Bot

## Intro:

Hello, this project is a alternative for make twitter BOT or little automation on your twitter, this code
is beggining and have just two functions, tweet and  retweet.

## Authorization:

Differentially of twitter official api, here you don't need to require one token, here your Authorization
is made using your Bearer token, cookies and CSRF token. All this tokens you use in your twitter headers,
just go on your network monitor on your navegator and get this information. 

## How I can Use?

Download:
```bash
$ npm install api_twitter
```

Using: 

```js 
// config
const API = require("api_twitter")
const bot = new API(BearerToken, csrfToken, AllCookies)

// New tweet

bot.twittar("hello world")

// Search

bot.Search("Birimbau")

// retweet 

bot.retweet("eye")

// the bot will retweet tweets that contain eye

```


