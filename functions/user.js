const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
const db = admin.firestore();



  // read item
app.get('/api/user', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.uid);
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

// read all
app.get('/api/user/:uid', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.uid);
            let prospect = await document.get();
            let response = { data : prospect.data(),
                            id: prospect.id};
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });



    


  // read item
app.get('/chats/messages/:chatId/:messagesId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('chats').doc(req.params.chatid);
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

// read all
app.get('/chats/messages/:chatId', (req, res) => {
    (async () => {
        try {
            const documentRef = db.collection('chats').doc(req.params.chatId);
            let query = documentRef.collection('messages');
            
            let response = [];
           
            await query.orderBy('DateCreated').get().then(querySnapshot => {
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

//Signup route

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
    }

    // TODO: validate data

 /*   firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201).json({ message: `user ${data.user.uid} signed up successfully`})
    })*/
    return res.status(201).json({ message: `user ${req.body.email} signed up successfully`})
    .catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
});

    exports.userApi= functions.https.onRequest(app);