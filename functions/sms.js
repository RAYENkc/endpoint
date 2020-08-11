const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const twilio = require('twilio');
const accountSid = 'ACe3a7f8b64fd0813aa6007c095725ef5d'
const authToken = '4fab69be812108b28a48983ba07a1878'


//const client = require('twilio')(accountSid, authToken);
const client = new twilio(accountSid, authToken);
const twilioNumber = '+1 205 672 4810'


//validate format

function validatE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}


app.get('/api/sms/:num/:cont', (req, res) => {
   
    (async () => {
        try {
            if( !validatE164(req.body.num)) {
                throw new Error('number must be E164 format')
              }
          const textMessage = {
            body:req.params.cont,
            to: req.params.num,
            from: twilioNumber
          }
          return client.messages.create(textMessage).then( res.status(200).send('okkkkkkkkkkkkkkkkkkkkkk'))
           
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });





exports.smsApi= functions.https.onRequest(app);