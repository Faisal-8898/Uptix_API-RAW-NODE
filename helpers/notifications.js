const https = require('https');
const { twilio } = require('./environments');

const notification = {};
notification.sendTwilioSms = (phone, msg, callback) => {
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const usrMsg = typeof msg === 'string' && msg.trim().length > 0 ? msg.trim() : false;

    if (userPhone && usrMsg) {
        const payload = {
            from: twilio.fromPhone,
            to: `+88${userPhone}`,
            body: usrMsg,
        };

        const stringifyPload = JSON.stringify(payload);
        //configure the request Details
    } else {
        callback('Given perameters were missing of invalid!');
    }
};
