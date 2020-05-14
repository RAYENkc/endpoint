
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();

// create
app.post('/event/create', (req, res) => {
    (async () => {
        try {
            await db.collection('events').doc().create(
              {
                start :  new Date( Date.parse(req.body.data) ),
                title : req.body.title ,
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
                        start: doc.data().start.toDate(),
                        title: doc.data().title,


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
            let response = { data :commercial.data(),
                             id: req.params.noteId};
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
exports.eventsApi= functions.https.onRequest(app);