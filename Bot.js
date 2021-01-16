const axios = require("axios").default
const dotenv = require("dotenv").config({
    path: "./config.env"
})


const ConfigBot = {
    token: process.env.TOKEN,
    csrftoken: process.env.CSRF_TOKEN,
    Cookies: process.env.COOKIES,
    key_word: process.env.KEY_WORD
}


class TwitterBot {
    constructor(BearerToken, csrfToken, AllCookies) {
        this.token = BearerToken
        this.baseURL_twittar = "https://twitter.com/i/api/1.1/statuses/update.json"
        this.BaseMensage = "include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&simple_quoted_tweet=true&trim_user=false&include_ext_media_color=true&include_ext_media_availability=true&auto_populate_reply_metadata=false&batch_mode=off&status=",
            this.csrfToken = csrfToken,
            this.Cookies = AllCookies,
            this.GeralHeaders = {
                authorization: this.token,
                "x-csrf-token": this.csrfToken,
                "x-twitter-active-user": "yes",
                "x-twitter-auth-type": "OAuth2Session",
                "x-twitter-client-language": "en",
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: this.Cookies
            }


    }

    twittar(mensage) {
        axios.post(this.baseURL_twittar, this.BaseMensage + mensage, {
            headers: this.GeralHeaders

        }).then(e => {
            if (e.status === 200) {
                console.log(`A frase ${mensage} foi tuitada com sucesso`)
            }
        }).catch(err => {
            console.log("Ocorreu um erro ao twittar: " + mensage + "\n\n\n\n\n ERROR: " + err)
        })
    }

    async Search(word) {
        const WORD_ENCODADO = encodeURIComponent(word + " lang:pt").replace(/'/g, "%27").replace(/"/g, "%22")
        const ValidateIDs = []
        const URL = `https://twitter.com/i/api/2/search/adaptive.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&q=${WORD_ENCODADO}%20lang%3Apt&tweet_search_mode=live&count=40&query_source=typed_query&cursor=refresh%3AthGAVUV0VFVBaOwLm92O2cvSUWgsCx8dGjnb0lEjUAFQAlABEVrPx5FYCJehgETkVXUxUAFQAVARUGFQAA&pc=1&spelling_corrections=1&ext=mediaStats%2ChighlightedLabel`
        await axios.get(URL, {
            headers: this.GeralHeaders
        }).then(e => {
            if (e.status === 200) {
                const Tweets = Object.values(e.data.globalObjects.tweets)
                Tweets.forEach(e => {
                    const data = {
                        id: e.id_str,
                        text: e.full_text
                    }
                    if (data.text.indexOf(word) !== -1) {
                        ValidateIDs.push(data.id)
                    }

                })



            }
        }).catch(err => {
            console.error("ERRO AO PESQUISAR: " + err)
        })

        return ValidateIDs.length ? ValidateIDs : false



    }

    async Retweet(word) {
        let counter = 0
        let Tweets = await this.Search(word)
        const url = "https://twitter.com/i/api/1.1/statuses/retweet.json"
        const baseDATA = "tweet_mode=extended&id="
        if (Tweets) {
            setInterval(async () => { 
               await axios.post(url, baseDATA + Tweets[Tweets.length - 1], {
                    headers: this.GeralHeaders
                }).then(async e => {
                    if (e.status === 200) {
                        counter += 1
                        Tweets.pop()
                        if (Tweets.length === 0) {
                            Tweets = await this.Search(word)
                        }
                        console.log(counter)
                    }
                }).catch(err => {
                    Tweets.pop()
                    console.log(err)
                })

            }, 87000)















        } else {
            console.error("Não há tweets para retweet")
        }




    }




}

const bot = new TwitterBot(ConfigBot.token, ConfigBot.csrftoken, ConfigBot.Cookies)

