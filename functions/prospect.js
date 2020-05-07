
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");
const t =admin.firestore.GeoPoint;
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
              { Social_Reason: req.body.Social_Reason,
                Phone: req.body.Phone,
                Mail: req.body.Mail,
                Address: req.body.Address,
                Role: req.body.Role,
                DateCreated: req.body.DateCreated,
                archive: req.body.archive,
                
               
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
            let response = { data : prospect.data(),
                            id: req.params.prospect_id};
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

//get Prospect archive
app.get('/archi/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
           
            await query.where('archive', '==', 'true').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        Social_Reason: doc.data().Social_Reason,
                        Phone: doc.data().Phone,
                        archive: doc.data().archive,
                        Address: doc.data().Address,
                        Role: doc.data().Role,
                        DateCreated: doc.data().DateCreated,
                       geo : doc.data().geo,
                      //  latitude : doc.data().geo._latitude,
                      //  longitude : doc.data().geo._longitude,

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

//get Prospect archive

app.get('/active/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
           
            await query.where('archive', '==', 'false').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        Social_Reason: doc.data().Social_Reason,
                        Phone: doc.data().Phone,
                        archive: doc.data().archive,
                        Address: doc.data().Address,
                        Role: doc.data().Role,
                        DateCreated: doc.data().DateCreated,
                       geo : doc.data().geo,
                      //  latitude : doc.data().geo._latitude,
                      //  longitude : doc.data().geo._longitude,

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

//get Prospect archive
app.get('/test/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
           
            await query.where('Address', '==', 'tunis').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        Social_Reason: doc.data().Social_Reason,
                        Phone: doc.data().Phone,
                        archive: doc.data().archive,
                        Address: doc.data().Address,
                        Role: doc.data().Role,
                        DateCreated: doc.data().DateCreated,
                       geo : doc.data().geo,
                      //  latitude : doc.data().geo._latitude,
                      //  longitude : doc.data().geo._longitude,

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
                        archive: doc.data().archive,
                        Address: doc.data().Address,
                        Role: doc.data().Role,
                        DateCreated: doc.data().DateCreated,
                       geo : doc.data().geo,
                      //  latitude : doc.data().geo._latitude,
                      //  longitude : doc.data().geo._longitude,

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
app.put('/api/update/:prospect_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('prospects').doc(req.params.prospect_id);
        await document.update({
           
           Social_Reason: req.body.Social_Reason,
           Phone: req.body.Phone,
         //  Mail: req.body.Mail,
           Address: req.body.Address,
           Role: req.body.Role,
           DateCreated: req.body.DateCreated,
           archive: req.body.archive,
        
            //geo : req.body.geo
            
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


/*********************************** CRUD Geoloaction ****************************************/


// create new geolocation

app.post('/api/geolocations/create/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
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
app.get('/api/geolocations/read/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            let query = documentRef.collection('geolocations');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedGeopoint = {
                       prospectId : req.params.prospectId,
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
app.get('/geolocations/read/:prospect_id/:geolocationId', (req, res) => {
        (async () => {
            try {
                const documentREF = db.collection('prospects').doc(req.params.prospect_id);
                const document = documentREF.collection('geolocations').doc(req.params.geolocationId);
                let prospect = await document.get();
                let response = { data : prospect.data(),
                                idProspect : req.params.prospect_id,
                                idGeo : req.params.geolocationId
                              };
                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
});
    

app.delete('/geolocations/delete/:prospect_id/:geolocationId', (req, res) => {
    (async () => {
        try {
            const documentREF = db.collection('prospects').doc(req.params.prospect_id);
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
app.put('/geolocations/update/:prospect_id/:geolocationId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospect_id);
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



    /*********************************** CRUD Notes ****************************************/


// create new notes

app.post('/notes/create/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            await documentRef.collection('notes').doc().create(
              { 
                idNote: req.body.idNote,
                textNote: req.body.textNote,
                dateNote : req.body.dateNote
            });
            return res.status(200).send(req.body.id);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });





// read all
app.get('/api/notes/read/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            let query = documentRef.collection('notes');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedNote = {
                       prospectId : req.params.prospectId,
                       idNote : doc.id,
                       textNote : doc.data().textNote,
                       dateNote : doc.data().dateNote,
                      
                    };
                    response.push(selectedNote);
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
app.get('/notes/read/:prospect_id/:noteId', (req, res) => {
        (async () => {
            try {
                const documentREF = db.collection('prospects').doc(req.params.prospect_id);
                const document = documentREF.collection('notes').doc(req.params.noteId);
                let prospect = await document.get();
                let response = { idNote : prospect.data().idNote,
                                 textNote : prospect.data().textNote,
                                 dateNote : prospect.data().dateNote,
                                idProspect : req.params.prospect_id,
                                idnoteId : req.params.noteId
                              };
                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
});
    

app.delete('/notes/delete/:prospect_id/:noteId', (req, res) => {
    (async () => {
        try {
            const documentREF = db.collection('prospects').doc(req.params.prospect_id);
            const document = documentREF.collection('notes').doc(req.params.noteId);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
    
    // update
app.put('/notes/update/:prospect_id/:noteId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospect_id);
            const document = documentRef.collection('notes').doc(req.params.noteId);
            await document.update({
                textNote : req.body.textNote,
                dateNote : req.body.dateNote,
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

app.post('/api/prospectMangers/create/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
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
app.get('/api/prospectMangers/read/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            let query = documentRef.collection('prospectMangers');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspectManger = {
                       prospectId : req.params.prospectId,
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
app.get('/prospectMangers/read/:prospect_id/:prospectMangerId', (req, res) => {
        (async () => {
            try {
                const documentREF = db.collection('prospects').doc(req.params.prospect_id);
                const document = documentREF.collection('prospectMangers').doc(req.params.prospectMangerId);
                let prospect = await document.get();
                let response = { data : prospect.data(),
                                idProspect : req.params.prospect_id,
                                idGeo : req.params.prospectMangerId
                              };
                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
});
    

app.delete('/prospectMangers/delete/:prospect_id/:prospectMangerId', (req, res) => {
    (async () => {
        try {
            const documentREF = db.collection('prospects').doc(req.params.prospect_id);
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
app.put('/prospectMangers/update/:prospect_id/:prospectMangerId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospect_id);
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

