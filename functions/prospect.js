const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const app = express();
app.use(cors({ origin: true }));


const accountSid = 'ACe3a7f8b64fd0813aa6007c095725ef5d'
const authToken = '4fab69be812108b28a48983ba07a1878'


//const client = require('twilio')(accountSid, authToken);
const client = require('twilio')(accountSid, authToken);
const twilioNumber = '+12056724810'

const nodemailer = require('nodemailer');

var serviceAccount = require("./permissions.json");
const t =admin.firestore.GeoPoint;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://departement-commercial.firebaseio.com"
});

const db = admin.firestore();



let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ezzeddineismahene13@gmail.com',
        pass: 'rayenkacem123'
    }
});



// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
           const now = moment();
            const newDoc = await db.collection('prospects').add(
              { 
                Social_Reason: req.body.Social_Reason,
                Phone: req.body.Phone,
                Mail: req.body.Mail,
                Address: req.body.Address,
                Role: req.body.Role,
                DateCreated: now.format('DD/MM/YYYY'),
                image: req.body.image,
                archive: 'false',
                
            });
        const newassig = await db.collection('assignments').add(
            { 
              IdCommercial: req.body.uid,
              IdCommercialAffect: 'null',
              IdProspect: newDoc.id,
              DateOfAssignment : now.format('DD/MM/YYYY'),
              description : '',
              valid: 'null'
          });

        /* const newnotification = await db.collection('notification').doc().add(
            { 
              title: 'New prospect ',
              description: "le commercial x a ajouter "+ req.body.Social_Reason+" email :  "+ req.body.Mail +" son adress :"+req.body.Address,
              DateOfNote: now.format('DD/MM/YYYY'),
              sendto:'admin'
             
          });*/
       
            return res.status(200).send(`${newDoc.id}`);


    
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });
  // create
app.post('/api/create/note', (req, res) => {
   
    (async () => {
        try {
            await db.collection('notification').doc().create(
              { title : "Title : " + req.body.title,
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });
  // read item
/*app.get('/api/read/:prospect_id', (req, res) => {
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
    });*/

      // read item
app.get('/api/read/:chatid', (req, res) => {
    (async () => {
        try {
            const document = db.collection('prospects').doc(req.params.chatid);
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
                        Mail : doc.data().Mail,
                       geo : doc.data().geo,
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

//get Prospect active
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
                        Mail : doc.data().Mail,
                        image: doc.data().image

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
                        Mail: doc.data().Mail,
                       geo : doc.data().geo,
                      

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
           Mail: req.body.Mail,
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


// update
app.put('/api/archi/:prospect_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('prospects').doc(req.params.prospect_id);
            await document.update({
               
               archive: 'true',
             
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// update
app.put('/api/active/:prospect_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('prospects').doc(req.params.prospect_id);
            await document.update({
               
               archive: 'false',
             
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
            const now = moment();
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            await documentRef.collection('notes').doc().create(
              {
                textNote: req.body.textNote,
                dateNote : now.format('DD/MM/YYYY'),
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

app.post('/api/VisAVis/create/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            await documentRef.collection('prospectMangers').doc().create(
              { 
                LastName: req.body.LastName,
                FiretName: req.body.FiretName,
                Phone : req.body.Phone,  
                Adress : req.body.Adress,
                Email : req.body.Email,
                Funct : 'vis a vis',
                
            });
            const dest = req.body.Email;
            //const FiretName = req.body.FiretName;
            const mailOptions = {
                from: 'kacemrayen13@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
                to: dest,
                subject: 'welcome to General Inox ' , // email subject
                html: `<p style="font-size: 16px;">
                    GÉNÉRAL INOX est une société industrielle opérant sur le marché de l’inox à l’échelle international.
                    Elle est spécialisée dans la fabrication et la vente des accessoires standards ou personnalisée en Inox à savoir pièces pour l’assemblage de garde-corps, 
                    rampes d’escaliers, balustrades, mains courantes et accessoires de meuble en Inox.
                    Général Inox est bien située sur le marché des accessoires en Inox par la qualité de ses produits. 
                    Sur un marché toujours plus exigeant où le rapport qualité prix se conjugue au quotidien avec le mot service,
                   GI a choisi de s’adosser à un réseau de partenaires dont les engagements s’inscrivent dans la continuité de la stratégie d’accompagnement auprès de ses clients.
                </p>
                    <br />
                  
                ` // email content in HTML
            };
      

            await documentRef.collection('emails').doc().create(
                {
                    title : 'welcome to General Inox ',
                    description : `<p style="font-size: 16px;">
                    GÉNÉRAL INOX est une société industrielle opérant sur le marché de l’inox à l’échelle international.
                    Elle est spécialisée dans la fabrication et la vente des accessoires standards ou personnalisée en Inox à savoir pièces pour l’assemblage de garde-corps, 
                    rampes d’escaliers, balustrades, mains courantes et accessoires de meuble en Inox.
                    Général Inox est bien située sur le marché des accessoires en Inox par la qualité de ses produits. 
                    Sur un marché toujours plus exigeant où le rapport qualité prix se conjugue au quotidien avec le mot service,
                   GI a choisi de s’adosser à un réseau de partenaires dont les engagements s’inscrivent dans la continuité de la stratégie d’accompagnement auprès de ses clients.
                </p>
                    <br />
                  
                ` ,
                dateEmail : new Date()
                }
            );
            // returning result
             transporter.sendMail(mailOptions, (erro, info) => {
                 
                if(erro){
                    return res.send(erro.toString());
                }
            });
         return res.status(200).send(req.body.id);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });

  app.post('/api/prospectManger/create/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            await documentRef.collection('prospectMangers').doc().create(
              { 
                LastName: req.body.LastName,
                FiretName: req.body.FiretName,
                Phone : req.body.Phone,  
                Adress : req.body.Adress,
                Email : req.body.Email,
                Funct : 'prospect Manger',
                
            });
            const dest = req.body.Email;
            //const FiretName = req.body.FiretName;
            const mailOptions = {
                from: 'kacemrayen13@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
                to: dest,
                subject: 'welcome to General Inox ' , // email subject
                html: `<p style="font-size: 16px;">
                    GÉNÉRAL INOX est une société industrielle opérant sur le marché de l’inox à l’échelle international.
                    Elle est spécialisée dans la fabrication et la vente des accessoires standards ou personnalisée en Inox à savoir pièces pour l’assemblage de garde-corps, 
                    rampes d’escaliers, balustrades, mains courantes et accessoires de meuble en Inox.
                    Général Inox est bien située sur le marché des accessoires en Inox par la qualité de ses produits. 
                    Sur un marché toujours plus exigeant où le rapport qualité prix se conjugue au quotidien avec le mot service,
                   GI a choisi de s’adosser à un réseau de partenaires dont les engagements s’inscrivent dans la continuité de la stratégie d’accompagnement auprès de ses clients.
                </p>
                    <br />
                  
                ` // email content in HTML
            };
      

            await documentRef.collection('emails').doc().create(
                {
                    title : 'welcome to General Inox ',
                    description : `<p style="font-size: 16px;">
                    GÉNÉRAL INOX est une société industrielle opérant sur le marché de l’inox à l’échelle international.
                    Elle est spécialisée dans la fabrication et la vente des accessoires standards ou personnalisée en Inox à savoir pièces pour l’assemblage de garde-corps, 
                    rampes d’escaliers, balustrades, mains courantes et accessoires de meuble en Inox.
                    Général Inox est bien située sur le marché des accessoires en Inox par la qualité de ses produits. 
                    Sur un marché toujours plus exigeant où le rapport qualité prix se conjugue au quotidien avec le mot service,
                   GI a choisi de s’adosser à un réseau de partenaires dont les engagements s’inscrivent dans la continuité de la stratégie d’accompagnement auprès de ses clients.
                </p>
                    <br />
                  
                ` ,
                dateEmail : new Date()
                }
            );
            // returning result
             transporter.sendMail(mailOptions, (erro, info) => {
                 
                if(erro){
                    return res.send(erro.toString());
                }
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


/*****  get histoprique of emails *****/

app.get('/emails/read/hist/:prospectId/:emailId', (req, res) => {
    (async () => {
        try {
            const documentREF = db.collection('prospects').doc(req.params.prospectId);
            const document = documentREF.collection('emails').doc(req.params.emailId);
            let prospect = await document.get();
            let response = { data : prospect.data(),
                            id : prospect.id,
                            
                          };
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
});


// read all
app.get('/emails/read/hist/:prospectId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('prospects').doc(req.params.prospectId);
            let query = documentRef.collection('emails');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspectManger = {
                        id: doc.id,
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

    /******************************************* filtrage poyr le prospect manger  ***************************/
    //get vis a vis of prospect 
app.get('/get/visavis/:prospectId',(req,res) => {
    (async () => {
        try {
            let documentRef = db.collection('prospects').doc(req.params.prospectId);
            let query = documentRef.collection('prospectMangers');
            let response = [];
           
            await query.where('Funct', '==', 'vis a vis').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        Mail : doc.data()
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

//get Manger of prospect
app.get('/get/ProspectManger/:prospectId',(req,res) => {
    (async () => {
        try {
            let documentRef = db.collection('prospects').doc(req.params.prospectId);
            let query = documentRef.collection('prospectMangers');
            
            let response = [];
           
            await query.where('Funct', '==', 'prospect Manger').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        Mail : doc.data()
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
    
    /***********************   filtrage     *****************************/

app.get('/filter/day',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
             
            const document = db.collection('prospects').doc();
            let prospect = await document.get();
           

            const now = moment();
          
            let response = [];
            x = 'DateCreated';
            y= now.format('DD/MM/YYYY');
            await query.where(x, '==', y).get().then(querySnapshot => {
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
                        Mail: doc.data().Mail,
                       
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


app.get('/filter/date',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
          //  let start = req.body.date;
            const now = moment();
            const dateFormatted = now.format('18/05/2020');
            await query.where('DateCreated', '==', dateFormatted).get().then(querySnapshot => {
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
            //console.log(response);
            return res.status(200).send(response );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
});



app.get('/filter/dateCreated',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
            let start = req.body.date;
           
            await query.orderBy('DateCreated').get().then(querySnapshot => {
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


//get Prospect active
app.get('/active/email',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
           
            await query.where('archive', '==', 'false').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        Mail : doc.data().Mail
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


app.get('/filter/day/:dd/:mm/:yyyy',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
             
            const document = db.collection('prospects').doc();
            let prospect = await document.get();
            let response = [];
            y = req.params.dd;
            z = req.params.mm;
            title = req.params.yyyy;
            await query.where('DateCreated', '==', y + '/' + z + '/' + title).get().then(querySnapshot => {
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
                        Mail: doc.data().Mail,
                        image: doc.data().image
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

//rappel of prospect visite
    //get Prospect active
    app.get('/rappel/event',(req,res) => {
        (async () => {
            try {
                let query = db.collection('events');
                const now = moment();
                let response = [];
                x = 'start';
                //y= now.format();
               // t = moment('2020-06-15').format("[Today is] dddd"); 
                s = '2020';
                var start =moment([2020, 4, 5]);
                var end   = moment([now.format('YYYY'),now.format('MM'),now.format('DD')]);
               //Date.now()
                await query.get().then(querySnapshot => {
                    let docs = querySnapshot.docs;
                  
                    for (let doc of docs) {
              if( moment(doc.data().start).format("D") === "15"){
                    const selectedProspect = {
                    id: doc.id,
                    data: doc.data(),
                    testto: moment(doc.data().start).fromNow(true),
                    test: moment(doc.data().start).toNow(),
                    testo: moment().months(),
                    startt:end.from(start),
                    endt: end.from(start, true),
                    d: now.format('DD')
                 };
                    response.push(selectedProspect);
                    }
                }
                    return response;
                });
                
                return res.status(200).send( response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
    });

//get social resont
app.get('/prospect/getsocielResion/:resion',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
           dd = req.params.resion;
           
            await query.where('Social_Reason', '==', dd ).get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                let nb = 0 ;
                for (let doc of docs) {
               
                    const selectedProspect = {
                        id: doc.id,
                        data: doc.data(), 
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


//get social resont
app.get('/prospect/Address/:Address',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
            Address = req.params.Address;
           
            await query.where('Address', '==', Address).get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                let nb = 0 ;
                for (let doc of docs) {
               
                    const selectedProspect = {
                        id: doc.id,
                        data: doc.data(), 
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


//get social resont
app.get('/prospect/getMail/:Mail',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
            Mail = req.params.Mail;
           
            await query.where('Mail', '==', Mail ).get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                let nb = 0 ;
                for (let doc of docs) {
               
                    const selectedProspect = {
                        id: doc.id,
                        data: doc.data(), 
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