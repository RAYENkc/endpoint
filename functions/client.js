const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const moment = require('moment');
app.use(cors({ origin: true }));
const db = admin.firestore();



// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            const now = moment();
            await db.collection('clients').doc().create(
              { Social_Reason: req.body.Social_Reason,
                Phone: req.body.Phone,
                Mail: req.body.Mail,
                Address: req.body.Address,
                Role: req.body.Role,
                DateCreated:  now.format('DD/MM/YYYY'), 
                TaxNumber: req.body.TaxNumber,
                DateOfLastOrder:  now.format('DD/MM/YYYY'),
                DataFirstOrder :  now.format('DD/MM/YYYY'),
               
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
  // read item
  app.get('/api/read/test/:client', (req, res) => {
    (async () => {
        try {
            y = req.params.client
            const document = db.collection('clients').where('TaxNumber', '==', y);
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
            TaxNumber: req.body.TaxNumber,
            DateOfLastOrder: req.body.DateOfLastOrder,
           
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


    /****************     filter       *************/

//get Prospect archive
app.get('/archi/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('prospects');
            
            let response = [];
            let id = "VyINeIbSXAvJ3wSQzlK0"
            await query.where('id', '==', id).get().then(querySnapshot => {
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


app.get('/filter/day',(req,res) => {
    (async () => {
        try {
            let query = db.collection('clients');
             
            const document = db.collection('clients').doc();
            let prospect = await document.get();
           

            const now = moment();
          
            let response = [];
           
            x = 'DateCreated';
            y= now.format('DD/MM/YYYY');
        //    y = firebase.firestore.Timestamp.fromDate(new Date());
        //    startfulldate = admin.firestore.Timestamp.now();
            await query.where(x, '==', y).get().then(querySnapshot => {
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
            let query = db.collection('clients');
             
            const document = db.collection('clients').doc();
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
app.get('/filter/DataFirstOrder/:dd/:mm/:yyyy',(req,res) => {
    (async () => {
        try {
            let query = db.collection('clients');
             
            const document = db.collection('clients').doc();
            let prospect = await document.get();
            let response = [];
            y = req.params.dd;
            z = req.params.mm;
            title = req.params.yyyy;
            await query.where('DataFirstOrder', '==', y + '/' + z + '/' + title).get().then(querySnapshot => {
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

app.get('/filter/DateOfLastOrder/:dd/:mm/:yyyy',(req,res) => {
    (async () => {
        try {
            let query = db.collection('clients');
             
            const document = db.collection('clients').doc();
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


//get social resont
app.get('/client/getsocielResion/:resion',(req,res) => {
    (async () => {
        try {
            let query = db.collection('clients');
            
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
app.get('/client/Address/:Address',(req,res) => {
    (async () => {
        try {
            let query = db.collection('clients');
            
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
app.get('/client/getMail/:Mail',(req,res) => {
    (async () => {
        try {
            let query = db.collection('clients');
            
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


/**********     notification    ***********/



// create new geolocation

app.post('/api/sendNotif/:clientId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('clients').doc(req.params.clientId);
            await documentRef.collection('notification').doc().create(
              { 
                content: req.body.content,
                title: req.body.title,
                timestamp: new Date()
            
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
                                //"title" : "New prospect ",// + msgData.Title,
                                "title" : "Title : " + req.body.title,
                                //"body" : "le commercial x a ajouter "+msgData.First_name +" "+msgData.Last_name+"  email :  "+msgData.Mail+" son adress :"+msgData.adress,// + msgData.desc,
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
                }  )
              
                );

            return res.status(200).send(req.body.id);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });





// read all
app.get('/api/notifications/read/:clientId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('clients').doc(req.params.clientId);
            let query = documentRef.collection('notification');
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


/**************     Filter     *************/

    app.get('/filter/DateOfLastOrder',(req,res) => {
        (async () => {
            try {
                let query = db.collection('clients');
                
                let response = [];
                let start = req.body.date;
               
                await query.orderBy('DateOfLastOrder').get().then(querySnapshot => {
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

    app.get('/filter/DataFirstOrder',(req,res) => {
        (async () => {
            try {
                let query = db.collection('clients');
                
                let response = [];
               
               
                await query.orderBy('DataFirstOrder').get().then(querySnapshot => {
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

    app.get('/filter/day',(req,res) => {
        (async () => {
            try {
                let query = db.collection('clients');
                
                let response = [];
             
                const now = moment();
                const dateFormatted = now.format('22/05/2020');
                await query.where('DateCreated', '==', new Date() ).get().then(querySnapshot => {
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
    

    app.get('/filter/day/:TaxNumber',(req,res) => {
        (async () => {
            try {
                let query = db.collection('clients');
                 
                const document = db.collection('clients').doc();
                let prospect = await document.get();
                let response = [];
                y = req.params.TaxNumber;
               
                await query.where('TaxNumber', '==', y ).get().then(querySnapshot => {
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
    
    app.get('/filter/uid/:uid',(req,res) => {
        (async () => {
            try {
                let query = db.collection('clients');
                let response = [];
                y = req.params.uid;
               
                await query.where('uid', '==', y ).get().then(querySnapshot => {
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
        

/**  update client with **/
app.put('/api/update/uid/:client_id/:uid', (req, res) => {
    (async () => {
        try {
            const document = db.collection('clients').doc(req.params.client_id);
            await document.update({
               
               uid: req.params.uid,
             
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });



  exports.clientApi= functions.https.onRequest(app);