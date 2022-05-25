const moment = require('moment-timezone');
const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || 'America/Sao_Paulo';

const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().tz(DEFAULT_TIMEZONE).format('hh:mm a')
    }
}

module.exports = formatMessage;
