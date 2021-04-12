const axios = require('axios');

class RandomQuoteController {
    static async getQuote(req, res, next) {
        try {
            const response = await axios({
                method: 'GET',
                url: 'http://api.forismatic.com/api/1.0/',
                params: {
                    method: 'getQuote',
                    key: 457653,
                    format: 'json',
                    lang: 'en',
                },
            });

            if (!response) throw err;

            res.status(200).json({
                randomQuote: response.data.quoteText,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = RandomQuoteController;
