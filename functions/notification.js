const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const moment = require('moment');
app.use(cors({ origin: true }));
const db = admin.firestore();



 // create
 app.post('/api/notification', (req, res) => {
    (async () => {
        try {
            const now = moment();
            const documentRef = db.collection('notification').doc();
            await documentRef.create(
              { 
                content: req.body.content,
                title: req.body.title,
                timestamp:  now.format('DD/MM/YYYY'),
                 sendto:'client'
            })
         
            
            return res.status(200).send(req.body.id);
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
            let query = db.collection('notification');
            
            let response = [];
           
            await query.orderBy('timestamp', "desc").get().then(
                
                querySnapshot => {
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



// read all
app.get('/api/read/client/notif', (req, res) => {
    (async () => {
        try {
            let query = db.collection('notification');
            
            let response = [];
           
          
                 await query.orderBy('timestamp', "desc").get().then(
                    querySnapshot => {
                        let docs = querySnapshot.docs;
                        for (let doc of docs) {
                            if(doc.data().sendto === "client"){
                            const selectedProspect= {
                                    id: doc.id,
                                    data : doc.data(),
                                
                            };
                            response.push(selectedProspect);
                        }

                           
                            
        
                        }
                        return response;
                    }
                    );

                
    
            
            //console.log(response);
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// delete
app.delete('/api/delete/:prospect_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('notification').doc(req.params.prospect_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

  exports.notifApi= functions.https.onRequest(app);