const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const app = express();
app.use(cors({ origin: true }));
const db = admin.firestore();
var msgData;

exports.nodifProspect = functions.firestore.document(
   // 'prospects/{prospectsId}'
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
                       "title" :  msgData.Social_Reason,
                       "body" : "  email :  " + msgData.Mail,
                       "sound" : "default"
                   },
                   "data":{
                       "sendername":  msgData.Social_Reason,
                       "message": msgData.Mail,
                       "click_action" : 'FLUTTER_NOTIFICATION_CLICK'
                   }

               }

               return admin.messaging().sendToDevice(tokens, payload).then((response)=>{
              
               
       
             
                  return res.status(200).send();
                
                 // console.log('Pushed them all');
               })
               .catch((err)=>{
                   console.log(err);
               })
           }
           

return  console.log('Pushed them all');


       }).catch((err)=>{
        console.log(err);
    })
});



/*

const functions = require('firebase-functions');
const admin = require('firebase-admin');


var msgData;

exports.nodif = functions.firestore.document(
    'Notification/{NotificationId}'
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
                       //"title" : "New prospect ",// + msgData.Title,
                       "title" : "Title : " + msgData.Title,
                       //"body" : "le commercial x a ajouter "+msgData.First_name +" "+msgData.Last_name+"  email :  "+msgData.Mail+" son adress :"+msgData.adress,// + msgData.desc,
                       "body" :"body :" + msgData.desc,
                       "sound" : "default"
                   },
                   "data":{
                       "sendername":  msgData.Title,
                       "message": msgData.desc,
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



*/