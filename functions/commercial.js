
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
            await db.collection('commercials').doc('/' + req.body.id + '/').create(
              { 
                IdManger: req.body.id,
                LastName: req.body.LastName,
                FirstName: req.body.FirstName,
                Phone : req.body.Phone,
                Adress : req.body.Adress,
                Mail : req.body.Mail
              
               
            }

            );
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });

  // read item
app.get('/api/read/:commercial_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('commercials').doc(req.params.commercial_id);
            let commercial = await document.get();
            let response = { data :commercial.data(),
                            id: req.params.commercial_id};
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
            let query = db.collection('commercials');
            
            let response = [];
           
            await query.get().then(querySnapshot => {
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

// update
app.put('/api/update/:commercial_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('commercials').doc(req.params.commercial_id);
        await document.update({
           
            IdManger: req.body.IdManger,
            LastName: req.body.LastName,
            FirstName: req.body.FirstName,
            Phone : req.body.Phone,
            Adress : req.body.Adress,
            Mail : req.body.Mail
          
            
        });
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

// delete
app.delete('/api/delete/:commercial_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('commercials').doc(req.params.commercial_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});


// get info of commercail
app.get('/info/commercail/:uid',(req,res) => {
    (async () => {
        try {
            let query = db.collection('commercials');
            let response = [];
            await query.where('uid', '==', req.params.uid ).get().then(querySnapshot => {
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

  exports.commercialApi= functions.https.onRequest(app);