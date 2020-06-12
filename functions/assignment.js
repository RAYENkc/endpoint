
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
            await db.collection('assignments').doc().create(
              { 
                IdAssignment: req.body.id,
                IdCommercial: req.body.IdCommercial,
                IdCommercialAffect: 'null',
                IdProspect: req.body.IdProspect,
                DateOfAssignment : new Date(),
                description : '',
                valid: 'null'
            });
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

    
        const document = db.collection('assignments').doc(req.params.assignmentId).set(req.body,{merge:true})
        .then(()=> res.json({id:req.params.assignmentId}))
        .catch((error)=> res.status(500).send(error));
       
    
});


// valid affectation
app.put('/api/valid/:assignmentId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('assignments').doc(req.params.assignmentId);
            await document.update({
                valid : 'true',
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// supprime l'affictation 
app.put('/api/refus/:assignmentId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('assignments').doc(req.params.assignmentId);
            await document.update({
                valid : 'false',
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

//get my Prospect 
app.get('/myprospects/read/:commercialId',(req,res) => {
    (async () => {
        try {
            let query = db.collection('assignments');
            
            let response = [];
           
            await query.where('IdCommercial', '==', req.params.commercialId).get().then(querySnapshot => {
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


//get asset with idProspect
app.get('/assig/read/:prospectId',(req,res) => {
    (async () => {
        try {
            let query = db.collection('assignments');
            
            let response = [];
           
            await query.where('IdProspect', '==', req.params.prospectId).get().then(querySnapshot => {
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

//get the prospect a assignment
app.get('/assignment/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('assignments');
            
            let response = [];
           
            await query.where('IdCommercialAffect', '==','0').get().then(querySnapshot => {
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



//get my prospect
app.get('/assig/read/my/:commercialId',(req,res) => {
    (async () => {
        try {
            let query = db.collection('assignments');
            let response = [];
            await query.where('IdCommercial', '==', req.params.commercialId).get().then(querySnapshot => {
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


//get asset with idProspect
app.get('/assig/to',(req,res) => {
    (async () => {
        try {
            let query = db.collection('assignments');
            
            let response = [];
           
            await query.where('valid', '==','changed').get().then(querySnapshot => {
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
  exports.assignmentApi= functions.https.onRequest(app);