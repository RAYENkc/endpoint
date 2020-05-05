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
            await db.collection('clients').doc('/' + req.body.id + '/').create(
              { Social_Reason: req.body.Social_Reason,
                Phone: req.body.Phone,
                Mail: req.body.Mail,
                Address: req.body.Address,
                Role: req.body.Role,
                DateCreated: req.body.DateCreated,
                TaxNumber: req.body.TaxNumber,
                DateOfLastOrder: req.body.DateOfLastOrder,
                DataFirstOrder : req.body.DataFirstOrder
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
app.get('/api/read/:client_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('clients').doc(req.params.client_id);
            let prospect = await document.get();
            let response = { data : prospect.data(),
                            id: req.params.client_id};
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
            let query = db.collection('clients');
            
            let response = [];
           
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
            //console.log(response);
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// update
app.put('/api/update/:client_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('clients').doc(req.params.client_id);
        await document.update({
            Social_Reason: req.body.Social_Reason,
            Phone: req.body.Phone,
            Mail: req.body.Mail,
            Address: req.body.Address,
            Role: req.body.Role,
            DateCreated: req.body.DateCreated,
            TaxNumber: req.body.TaxNumber,
            DateOfLastOrder: req.body.DateOfLastOrder,
            DataFirstOrder : req.body.DataFirstOrder
        });
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

// delete
app.delete('/api/delete/:client_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('clients').doc(req.params.client_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});


/*********************************** CRUD Geoloaction ****************************************/


// create new geolocation

app.post('/api/geolocations/create/:clientId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('clients').doc(req.params.clientId);
            await documentRef.collection('geolocations').doc().create(
              { 

              geo: new t (  req.body.geo.lat,
                           req.body.geo.long,
                 ),
            });
            return res.status(200).send(req.body.id);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });





// read all
app.get('/api/geolocations/read/:clientId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('clients').doc(req.params.clientId);
            let query = documentRef.collection('geolocations');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedGeopoint = {
                       clientId : req.params.clientId,
                        idGeo : doc.id,
                       geo : doc.data().geo,
                      
                    };
                    response.push(selectedGeopoint);
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
//get one geo location
app.get('/geolocations/read/:clientid/:geolocationId', (req, res) => {
        (async () => {
            try {
                const documentREF = db.collection('clients').doc(req.params.clientid);
                const document = documentREF.collection('geolocations').doc(req.params.geolocationId);
                let prospect = await document.get();
                let response = { data : prospect.data(),
                                idclient : req.params.clientid,
                                idGeo : req.params.geolocationId
                              };
                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
});
    

app.delete('/geolocations/delete/:clientid/:geolocationId', (req, res) => {
    (async () => {
        try {
            const documentREF = db.collection('clients').doc(req.params.clientid);
            const document = documentREF.collection('geolocations').doc(req.params.geolocationId);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
    
    // update
app.put('/geolocations/update/:clientid/:geolocationId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.clientid);
            const document = documentRef.collection('geolocations').doc(req.params.geolocationId);
            await document.update({
              
            
                geo : req.body.geo
                
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });




  
    /*********************************** CRUD Prospect Manager  ****************************************/


// create new Prospect manger

app.post('/api/prospectMangers/create/:clientId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('clients').doc(req.params.clientId);
            await documentRef.collection('prospectMangers').doc().create(
              { 

                IdProMang: req.body.IdProMang,
                LastName: req.body.LastName,
                FiretName: req.body.FiretName,
                Phone : req.body.Phone,
                Adress : req.body.Adress,
                Funct : req.body.Funct
            });
            return res.status(200).send(req.body.id);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });





// read all
app.get('/api/prospectMangers/read/:clientId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.clientId);
            let query = documentRef.collection('prospectMangers');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspectManger = {
                       prospectId : req.params.clientId,
                        idProspectManger : doc.id,
                        data : doc.data(),
                      
                    };
                    response.push(selectedProspectManger);
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
//get one geo location
app.get('/prospectMangers/read/:clientId/:prospectMangerId', (req, res) => {
        (async () => {
            try {
                const documentREF = db.collection('clients').doc(req.params.clientId);
                const document = documentREF.collection('prospectMangers').doc(req.params.prospectMangerId);
                let prospect = await document.get();
                let response = { data : prospect.data(),
                                idProspect : req.params.clientId,
                                idGeo : req.params.prospectMangerId
                              };
                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
});
    

app.delete('/prospectMangers/delete/:clientId/:prospectMangerId', (req, res) => {
    (async () => {
        try {
            const documentREF = db.collection('clients').doc(req.params.clientId);
            const document = documentREF.collection('prospectMangers').doc(req.params.prospectMangerId);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
    
    // update
app.put('/prospectMangers/update/:clientId/:prospectMangerId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('clients').doc(req.params.clientId);
            const document = documentRef.collection('prospectMangers').doc(req.params.prospectMangerId);
            await document.update({
              
            
                IdProMang: req.body.IdProMang,
                LastName : req.body.LastName,
                FiretName: req.body.FiretName,
                Phone : req.body.Phone,
                Adress : req.body.Adress,
                Funct : req.body.Funct
               
                
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });


  exports.clientApi= functions.https.onRequest(app);