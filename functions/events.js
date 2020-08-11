
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
const moment = require('moment');
const db = admin.firestore();

// create
app.post('/event/create', (req, res) => {
    (async () => {
        try {
            await db.collection('events').doc().create(
              {
               // start :  new Date( Date.parse(req.body.data)),
                start : req.body.data,
                title : req.body.title,
                with : req.body.uid,
                type : req.body.type,
                descripion :'Vous avez une visite avec le '+ req.body.type + ' : ' + req.body.withProspect + '         '+ req.body.descripion,
                event: 'true'            
              }

            );
            return res.status(200).send();
        } catch (error) {
            console.log(error);

            return res.status(500).send(error);
        }
      })();
  });

//get event
app.get('/event/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('events');
            
            let response = [];
           
            await query.where('event', '==', 'true').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id : doc.id,
                        start: doc.data().start,
                        title: doc.data().title,
                        with: doc.data().with,
                        type: doc.data().type,
                        descripion: doc.data().descripion

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


// update
app.put('/event/update/:eventId', (req, res) => {
    const document = db.collection('events').doc(req.params.eventId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.eventId}))
    .catch((error)=> res.status(500).send(error));
 });
 
// delete
app.delete('/event/delete/:eventId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('events').doc(req.params.eventId);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
    
  // read note
  app.get('/event/read/:eventId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('events').doc(req.params.eventId);
            let commercial = await document.get();
            let response = { data :commercial.data(),
                             id: req.params.eventId};
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

  
/*****************************************      notes       ************************************************/

  
// create
app.post('/note/create', (req, res) => {
    (async () => {
        try {
            await db.collection('events').doc().create(
              {
                event: 'false',
                title : req.body.title               
              }

            );
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });


  
//get Prospect archive
app.get('/note/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('events');
            
            let response = [];
           
            await query.where('event', '==', 'false').get().then(querySnapshot => {
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


// create
app.post('/note/create', (req, res) => {
    (async () => {
        try {
            await db.collection('events').doc('/' + req.body.id + '/').create(
              {
               
                title : req.body.title               
              }

            );
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });


  
//get Prospect archive
app.get('/note/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('events');
            
            let response = [];
           
            await query.where('event', '==', 'false').get().then(querySnapshot => {
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

// update
app.put('/note/update/:noteId', (req, res) => {
    const document = db.collection('events').doc(req.params.noteId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.noteId}))
    .catch((error)=> res.status(500).send(error));
 });
 
// delete
app.delete('/note/delete/:noteId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('events').doc(req.params.noteId);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
    
  // read note
  app.get('/note/read/:noteId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('events').doc(req.params.noteId);
            let commercial = await document.get();
            let response = { 
                            data :commercial.data(),
                             id: req.params.noteId
                            };
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

    //get Prospect active
app.get('/rappel/event',(req,res) => {
    (async () => {
        try {
            let query = db.collection('events');
            const now = moment();
            let response = [];
            x = 'start';
            //y= now.format();
        //    t = moment('2020-06-15').format("[Today is] dddd"); 
            s = '2020';
            var start =moment([2020, 4, 5]);
            var end   = moment([now.format('YYYY'),now.format('MM'),now.format('DD')]);
           //Date.now()
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
              
                for (let doc of docs) {
         if ((moment(doc.data().start).format("DD/MM/YYYY") === now.format("DD/MM/YYYY")) & (moment(doc.data().start).format("HH") === now.format("HH"))) {
                const selectedProspect = {
                id: doc.id,
                data: doc.data(),
                test: moment(doc.data().start).toNow(),
                testo: moment().months(),
                startt:end.from(start),
                endt: moment(doc.data().start).format("DD/MM/YYYY"),
                d: now.format("HH:mm"),
                testb: moment(doc.data().start).format("HH:mm"),
                testa:moment([2007, 0, 29]).fromNow(),
                teste:new Date(),
                testu:  now.format('DD/MM/YYYY HH:mm '),

           
             };
                response.push(selectedProspect);
           }
            }
                return response;
            }).then(
                db.collection('pushtokens').get().then((snapshot)=>{
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
                                "title" : "Title : " + doc.data().title,
                                "body" :"body :" + "you have is event at " + moment(doc.data().start).format("DD/MM/YYYY"),
                                "sound" : "default"
                            },
                            "data":{
                                "sendername":  doc.data().title,
                                "message":doc.data().title,
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
                })
            );
            
            return res.status(200).send( response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
});


    //get Prospect active
    app.get('/rappel/event',(req,res) => {
        (async () => {
            try {
                let query = db.collection('events');
                const now = moment();
                let response = [];
                x = 'start';
                s = '2020';
                await query.get().then(querySnapshot => {
                    let docs = querySnapshot.docs;
                    for (let doc of docs) {
                    const selectedProspect = {
                    id: doc.id,
                    data: doc.data(),
                 };
                    response.push(selectedProspect);
               }
                    return response;
                });
                return res.status(200).send( response, newDoc.id );
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
    });
// events with notifications
app.post('/api/events', (req, res) => {
        (async () => {
            try {
                const now = moment();
                await  db.collection('notification').doc().create(
                  { 
                    title: req.body.title,
                    content: req.body.content,
                    timestamp:  now.format('DD/MM/YYYY at HH:mm'),
                    uid: req.body.uid
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
                                    "title" : "Title : " + req.body.title,
                                    "body" :"body :" + req.body.content,
                                    "sound" : "default"
                                },
                                "data":{
                                    "sendername": req.body.title,
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
                    );
                
                return res.status(200).send(req.body.id);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
          })();
      });


 app.post('/api/event/nonotif', (req, res) => {
        (async () => {
            try {
                const now = moment();
                await  db.collection('notification').doc().create(
                  { 
                    title: req.body.title,
                    content: req.body.content,
                    timestamp:  now.format('DD/MM/YYYY at HH:mm'),
                    uid: req.body.uid
                });
                
                return res.status(200).send(req.body.id);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
          })();
      });

//get asset with idProspect
app.get('/events/day/prospect/:dd/:mm/:yyyy/:uid',(req,res) => {
    (async () => {
        try {
            let query = db.collection('events');
            
            let response = [];
           dd = req.params.dd;
           mm = req.params.mm;
           yyyy = req.params.yyyy;
            await query.where('start', '==', dd + '/' + mm + '/' + yyyy).get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                let nb = 0 ;
                for (let doc of docs) {
                    if( doc.data().uid === req.params.uid){
                        if( doc.data().type === 'prospect' ){
                    const selectedProspect = {
                        id: doc.id,
                        data: doc.data(), 
                    };
                    response.push(selectedProspect);
                }
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

//get asset with idProspect
app.get('/events/day/client/:dd/:mm/:yyyy/:uid',(req,res) => {
    (async () => {
        try {
            let query = db.collection('events');
            
            let response = [];
           dd = req.params.dd;
           mm = req.params.mm;
           yyyy = req.params.yyyy;
            await query.where('start', '==', dd + '/' + mm + '/' + yyyy).get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                let nb = 0 ;
                for (let doc of docs) {
                    if( doc.data().uid === req.params.uid){
                        if( doc.data().type === 'client' ){
                    const selectedProspect = {
                        id: doc.id,
                        data: doc.data(), 
                    };
                    response.push(selectedProspect);
                }
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

    
exports.eventsApi= functions.https.onRequest(app);