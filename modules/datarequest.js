/**
 *
 * @fileoverview Here are all functions where we are going to make GET requests to sites which are giving us data for given arguments.
 * @author Julian Yaman
 *
 */

// Requiring got for making requests
const got = require('got')
const config = require('./../config.json')
const Util = require('./util')

/**
 * Function which is receiving data from Wikipedia by giving a term to search in the Wikipedia Database and returns
 * short summaries.
 *
 * @param {String} url - URL for requesting data (Wikipedia)
 * @param msg - Message class of Discord.js
 * @param {String} argument - Argument sent by the user -> !wiki [argument]
 * @since 1.0.1
 *
 * @public
 */
exports.getWikipediaSummary = (url, msg, argument) => {
  got(url).then(res => {
    try {
      let pageContent = JSON.parse(res.body).query.pages
      let keys = Object.keys(pageContent)

      let summary

      if (pageContent[keys[0]].extract.split('.', 2).length <= 1) {
        summary = 'Click on the Link above to see the Wikipedia article about ' + pageContent[keys[0]].title
      } else {
        // First lines of the Wikipedia article
        summary = pageContent[keys[0]].extract.toString().match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g)

        summary = summary[0] + summary[1]

        // console.log(summary);
        // console.log("-----");
        // let stringSplitting = pageContent[keys[0]].extract.toString().match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
        // console.log(stringSplitting[0] + stringSplitting[1]);

        // Replacing all HTML Tags included in the text
        summary = summary.replace(/<(?:.|\n)*?>/gm, '')
      }

      // HTTPS Request for receiving the URL of the article by giving the page ID as the value for the pageids parameter in the API request to Wikipedia
      got('https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&inprop=url&pageids=' + pageContent[keys[0]].pageid).then(pageres => {
        try {
          // JSON data of the page with the page id pageid
          let pageObject = JSON.parse(pageres.body).query.pages

          let key = Object.keys(pageObject)

          // Get the value of the fullurl parameter
          let wikipediaArticleLink = pageObject[key[0]].fullurl

          // Sending the final result of the two requests as an embed to the channel where the command
          // was executed.
          msg.channel.send({
            embed: {
              color: 3447003,
              author: {
                icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                name: 'Wikipedia'
              },
              title: pageContent[keys[0]].title + ' (wikipedia article)',
              url: wikipediaArticleLink,
              description: summary,
              timestamp: new Date(),
              footer: {
                icon_url: 'https://upload.wikimedia.org/wikipedia/en/2/28/WikipediaMobileAppLogo.png',
                text: 'Information by Wikipedia. wikipedia.org'
              }
            }
          })
        } catch (e) {
          msg.react('⛔')
          msg.channel.send(
            'You got a very rare error here, how did you get that? Write it to our GitHub Repository\n' +
            'https://github.com/sleme/pal-bot')
        }
      })
    } catch (e) {
      msg.react('⛔')
      msg.channel.send(
        'Cannot get data from Wikipedia. Please check your spelling and upper and lower case. (Mostly it is upper and lower case because Wikipedia pay attention to it.)\n' +
        '```You´ve sent the value: ' + argument + '```')
    }
  }).catch(error => {
    console.log(error.response.body)
  })
}

/**
 * With this function, you´ll get the current price of any crypto currency you want to have. Currencies with a whitespace must be changed to a "-".
 *
 * @param msg - Message class of Discord.js
 * @param {String} [cryptoCurrency=Bitcoin] - The crypto currency to check for. (No symbol but full name of the currency)
 * @param {String} [convertCurrency=USD] - The currency to show the current price. (Symbol required, NOT full name of the currency)
 * @since 1.3
 *
 * @public
 */
exports.getCryptoCurrencyPrice = (msg, cryptoCurrency, convertCurrency) => {
  // ToDO: Find out why the convertCurrency default value is undefined... (idk why but it is undefined, try it without giving this argument).

  // Making request to the CoinMarketCap API.
  got('https://api.coinmarketcap.com/v1/ticker/' + cryptoCurrency + '/?convert=' + convertCurrency).then(res => {
    try {
      // Results as JSON
      let priceResults = JSON.parse(res.body)
      // convertCurrency in lower case for getting the value of the price property. (To get an example, just look in the for-loop)
      let currency = convertCurrency.toLowerCase()

      // This console.log is just for development purposes.
      // console.log("convertCurrency: " + convertCurrency + "; cryptoCurrency: " + cryptoCurrency + "; currency: " + currency);

      // convertCurrency is in uppercase. currency MUST be in lower case.

      if (currency === 'usd') {
        // Default currency is the US dollar.

        // Checking if crypto currency is Bitcoin so we can send a message which does not contain two bitcoin values (so it would send that 1 BTC is equal to 1 BTC, wow, what a miracle)
        if (cryptoCurrency.toLowerCase() === 'bitcoin') {
          msg.channel.send('Currently, 1 ' + priceResults[0]['name'] + ' (__**1 ' + priceResults[0]['symbol'] + '**__) is **' + Util.roundNumber(priceResults[0]['price_usd'], 2) + ' ' + convertCurrency.toUpperCase() + '** worth.')
        } else {
          msg.channel.send('Currently, 1 ' + priceResults[0]['name'] + ' (__**1 ' + priceResults[0]['symbol'] + '**__) is **' + Util.roundNumber(priceResults[0]['price_' + currency], 2) + ' ' + convertCurrency.toUpperCase() + '** worth ' +
            'which is equal to **' + priceResults[0]['price_btc'] + ' Bitcoins**.')
        }
      } else {
        // Checking if there is any result for the given currency.
        // The price property can be undefined if there is no value because this key does not exists.
        if (priceResults[0]['price_' + currency] !== undefined) {
          if (currency === 'btc' || cryptoCurrency.toLowerCase() === 'bitcoin') {
            msg.channel.send('Currently, 1 ' + priceResults[0]['name'] + ' (__**1 ' + priceResults[0]['symbol'] + '**__) is **' + Util.roundNumber(priceResults[0]['price_' + currency], 2) + ' ' + convertCurrency.toUpperCase() + '** worth.')
          } else {
            msg.channel.send('Currently, 1 ' + priceResults[0]['name'] + ' (__**1 ' + priceResults[0]['symbol'] + '**__) is **' + Util.roundNumber(priceResults[0]['price_' + currency], 2) + ' ' + convertCurrency.toUpperCase() + '** worth ' +
              'which is equal to **' + priceResults[0]['price_btc'] + ' Bitcoins**.')
          }
        } else {
          // If there is no result (caused by the fact that the given currency does not exist), it will throw an error that the currency does not exist.
          throw new Error('No currency found...')
        }
      }
    } catch (e) {
      // Logging the exception, for development and production usage reasons.
      console.log(e)
      console.log('Currency to check: ' + cryptoCurrency + '; Currency: ' + convertCurrency)

      // Sending a message that shows the user, how to use the command correctly
      msg.channel.send("⛔️ Please check your given arguments. If you have currencies like '**Bitcoin Cash**' you must write a **-** between the two words. Please check the exchange currency you wrote. \n" +
        '__For example__: Bitcoin**-**Cash or Ethereum**-**Classic\n\n' +
        "Here is a list with supported 'real' currencies (you can convert into crypto currencies too like BTC or ETH and so on): \n" +
        '```Real currencies: AUD, BRL, CAD, CHF, CLP, CNY, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PKR, PLN, RUB, SEK, SGD, THB, TRY, TWD, ZAR```')
    }
  }).catch(error => {
    console.log('Currency to check: ' + cryptoCurrency + '; Currency: ' + convertCurrency)
    console.log(error)

    // Sending a message for the user so he knows what to do next.
    msg.channel.send("Please check your given arguments. Check if your currency exists or if you wrote it wrong. If you have a currency like '**Bitcoin Cash**' you must write a **-** between the two words and replace the whitespace.\n" +
      '__For example__: Bitcoin**-**Cash or Ethereum**-**Classic \n\n' +
      'Usage: ``' + config.prefix + 'crypto [crypto currency] (e.g. Bitcoin or Ethereum-Classic) [currency] (default: USD; example: EUR, PLN, BTC, ETH, ...)``')
  })
}

/**
 * Search GIF with given term
 * @param msg - Message class of Discord.js
 * @param {String} searchQuery - Search tag for searching a GIF in GIPHY.
 * @since masterBranch-1.3
 *
 * @public
 */
exports.getGifFromGIPHY = (msg, searchQuery) => {
  got('http://api.giphy.com/v1/gifs/random?api_key=' + config.giphyKey + '&tag=' + searchQuery).then(res => {
    try {
      let result = JSON.parse(res.body)
      return msg.channel.send(result.data.image_original_url)
    } catch (e) {
      console.error(e)
      throw new Error('GIF command didnt work: please check error exception.')
    }
  })
}
