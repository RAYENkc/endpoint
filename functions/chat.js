const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
const db = admin.firestore();



// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            await db.collection('chats').doc('/' + req.body.id + '/').create(
              { 
                id : req.body.id  
              }
            );
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });
  // create
app.post('/api/messages/:chatid', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('chats').doc(req.params.chatid);
            await documentRef.collection('messages').doc().create(
              { 
                
                content: req.body.content,
                photoUrl: req.body.photoUrl,
                sender: req.body.sender,
                senderId: req.body.senderId,
                timestamp: new Date()

                
            }).then(
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
                                "title" : "Title : " + req.body.sender,
                                "body" :"body :" + req.body.content,
                                "sound" : "default"
                            },
                            "data":{
                                "sendername": req.body.sender,
                                "message": req.body.content,
                                "click_action" : 'FLUTTER_NOTIFICATION_CLICK'
                            }
         
                        }
                         admin.messaging().sendToDevice(tokens, payload).then((response)=>{
                            return   console.log('Pushed them all');
                           }).catch((err)=>{
                               console.log(err);
                           })
                    }
                    return  console.log('Pushed them all');
                })
                ).then(
                    db.collection('chats').doc(req.params.chatid).update({
                          date: new Date()
                    })
                );
            
            return res.status(200).send(req.body.id);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });



  // read item
app.get('/api/read/:chatid', (req, res) => {
    (async () => {
        try {
            const document = db.collection('chats').doc(req.params.chatid);
            let commercial = await document.get();
            let response = { data :commercial.data(),
                            id: req.params.chatid};
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('chats');
            
            let response = [];
           
            await query.orderBy('date', 'desc').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        data : doc.data(),
                    };
                    response.push(selectedProspect);
                    

                }
                return response;
             
            });
            //console.log(response);
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

  // read item
app.get('/chats/messages/:chatId/:messagesId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('chats').doc(req.params.chatid);
            let commercial = await document.get();
            let response = { data :commercial.data(),
                            id: req.params.chatid};
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// read all
app.get('/chats/messages/:chatId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('chats').doc(req.params.chatId);
            let query = documentRef.collection('messages');
            let response = [];
            await query.orderBy('timestamp', 'desc').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        data : doc.data(),

                    };
                    response.push(selectedProspect);
                    

                }
                return response;
             
            });
            //console.log(response);
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });


//my chat list 
// read all
app.get('/api/client/read/:uid', (req, res) => {
    (async () => {
        try {
            let query = db.collection('chats');
            
            let response = [];
                    
                    await query.orderBy('date', "desc").get().then(
                        querySnapshot => {
                            let docs = querySnapshot.docs;
                            for (let doc of docs) {
                                if(doc.data().client === req.params.uid){
                                const selectedProspect= {
                                        id: doc.id,
                                        data : doc.data(),
        
                                };
                                response.push(selectedProspect);
                            }
                }
                return response;
             
            });
            //console.log(response);
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

    // read all
app.get('/api/admin/read/:uid', (req, res) => {
    (async () => {
        try {
            let query = db.collection('chats');
            
            let response = [];
                    
                    await query.orderBy('date', "desc").get().then(
                        querySnapshot => {
                            let docs = querySnapshot.docs;
                            for (let doc of docs) {
                                if(doc.data().admin === req.params.uid){
                                const selectedProspect= {
                                        id: doc.id,
                                        data : doc.data(),
                                    
                                };
                                response.push(selectedProspect);
                            }
                }
                return response;
             
            });
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// get client chat
app.get('/info/client/chat/:uid',(req,res) => {
    (async () => {
        try {
            let query = db.collection('chats');
            let response = [];
            await query.where('client', '==', req.params.uid ).get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                       data: doc.data()
                    };
                    response.push(selectedProspect);
                }
                return response;
            });
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
});

    exports.chatApi= functions.https.onRequest(app);