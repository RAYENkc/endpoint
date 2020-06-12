/*
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");


const { ApolloServer, gql } = require("apollo-server-express");

import ApolloClient, { InMemoryCache } from "apollo-boost";

const token = await auth.currentUser.getIdToken(true);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  headers: { token: token },
  uri: "http://localhost:3000/graphql"
});


graphqlExpress((req, res) => {
    const context = createExpressContext(
      {
        firebaseToken: req.headers.token
      },
      res
    );
  
    return {
      schema,
      context
    };
  })*/


  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  const express = require('express');
  const cors = require('cors');
  const app = express();
  app.use(cors({ origin: true }));
  const db = admin.firestore();

  
  app.post('/signup',async (request, response) => {
    var username = request.body.username;
    var useremail = request.body.useremail;
    var userpassword = request.body.userpassword;
    await db.collection('users').doc().create(
      { 
        username: username ,
        useremail: useremail,
        userpassword: userpassword,
     
    });


    await admin.auth().createUser({
        email: useremail,
        password: userpassword,
        displayName: username,
     //   photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          //add data to database
        

            return response.status(200).send("tttttt");
        })
        .catch(function(error) {
       // return res.status(501).send(request.body.id); 
         console.log('Error creating new user:', error);
        });
    });

    
     // read item
app.get('/api/read/:email', (req, res) => {
  (async () => {
      try {
        email =req.body.email;
      await  admin.auth().getUserByEmail(email)
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          return   console.log('Successfully fetched user data:', userRecord.toJSON());
        })
        .catch(function(error) {
          return   console.log('Error fetching user data:', error);
        });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send('Error fetching user data:', error);
      }
      })();
  });



  // update
app.put('/api/update', (req, res) => {
  (async () => {
      try {
      await  admin.auth().updateUser('W2Fnet5YYBficDSfyjXtJlb7fN52', {
          email: 'modifiedUser@example.com',
          emailVerified: true,
          password: 'newPassword',
          displayName: 'Jane Doe',
          photoURL: 'http://www.example.com/12345678/photo.png',
          disabled: true
        })
          .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
           return console.log('Successfully updated user', userRecord.toJSON());
          })
          .catch(function(error) {
            console.log('Error updating user:', error);
          });
          return res.status(200).send(userRecord.toJSON());
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });




  // read item
  app.get('/email/:email/:password', (req, res) => {
    (async () => {
      
      firebase.signInWithEmail(req.body.email,req.body.password, function(err, result){
        if (err)
          console.log(err);
        else
          console.log(result);
      });
    });
  });

exports.authapi= functions.https.onRequest(app);