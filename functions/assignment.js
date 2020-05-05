
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
            await db.collection('assignments').doc('/' + req.body.id + '/').create(
              { 
                IdAssignment: req.body.id,
                IdCommercial: req.body.IdCommercial,
                IdCommercialAffect: req.body.IdCommercialAffect,
                IdProspect: req.body.IdProspect,
                DateOfAssignment : req.body.DateOfAssignment,
                description : req.body.description,
                valid: req.body.valid
              
               
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
app.get('/api/read/:assignmentId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('assignments').doc(req.params.assignmentId);
            let commercial = await document.get();
            let response = { data :commercial.data(),
                             id: req.params.assignmentId};
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
            let query = db.collection('assignments');
            
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
app.put('/api/update/:assignmentId', (req, res) => {
(async () => {
    try {
        const document = db.collection('assignments').doc(req.params.assignmentId);
        await document.update({
            IdAssignment: req.body.id,
            IdCommercial: req.body.IdCommercial,
            IdCommercialAffect: req.body.IdCommercialAffect,
            IdProspect: req.body.IdProspect,
            DateOfAssignment : req.body.DateOfAssignment,
            description : req.body.description,
            valid: req.body.valid
    
        });
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

// delete
app.delete('/api/delete/:assignmentId', (req, res) => {
(async () => {
    try {
        const document = db.collection('assignments').doc(req.params.assignmentId);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});




  exports.assignmentApi= functions.https.onRequest(app);