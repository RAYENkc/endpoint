const functions = require('firebase-functions');
const admin = require('firebase-admin');


var msgData;

exports.nodif = functions.firestore.document(
    'notification/{notificationId}'
).onCreate((snapshot, context)=>{
       msgData = snapshot.data();

       admin.firestore().collection('pushtokens').get().then((snapshot)=>{
           var tokens = [];
           if(snapshot.empty) {
               console.log('No divices'); 
           }
           else{
               for(var token of snapshot.docs){
                   tokens.push(token.data().devtoken);
               } 
               

               var payload = {
                   "notification" : {
                       "title" : "Title : " + msgData.title,
                       "body" :"body :" + msgData.description,
                       "sound" : "default"
                   },
                   "data":{
                       "sendername":  msgData.title,
                       "message": msgData.description,
                       "click_action" : 'FLUTTER_NOTIFICATION_CLICK'
                   }

               }

               return admin.messaging().sendToDevice(tokens, payload).then((response)=>{
                return   console.log('Pushed them all');
               }).catch((err)=>{
                   console.log(err);
               })
           }
return  console.log('Pushed them all');
       }).catch((err)=>{
        console.log(err);
    })
});