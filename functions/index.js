const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));


var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://departement-commercial.firebaseio.com"
});

const db = admin.firestore();



// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            await db.collection('prospects').doc('/' + req.body.id + '/').create(
              {Social_Reason: req.body.Social_Reason,
                Phone: req.body.Phone,
                Mail: req.body.Mail,
                Address: req.body.Address,
                Role: req.body.Role,
                DateCreated: req.body.DateCreated
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
app.get('/api/read/:prospect_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('prospects').doc(req.params.prospect_id);
            let prospect = await document.get();
            let response = prospect.data();
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
            let query = db.collection('prospects');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        Social_Reason: doc.data().Social_Reason,
                        Phone: doc.data().Phone,
                        Mail: doc.data().Mail,
                        Address: doc.data().Address,
                        Role: doc.data().Role,
                        DateCreated: doc.data().DateCreated,

                    };
                    response.push(selectedProspect);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// update
app.put('/api/update/:prospect_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('prospects').doc(req.params.prospect_id);
        await document.update({
            Social_Reason: req.body.Social_Reason,
            Phone: req.body.Phone,
            Mail: req.body.Mail,
            Address: req.body.Address,
            Role: req.body.Role,
            DateCreated: req.body.DateCreated,
        });
        return res.status(200).send();
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
        const document = db.collection('prospects').doc(req.params.prospect_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});


exports.prospectApi= functions.https.onRequest(app);