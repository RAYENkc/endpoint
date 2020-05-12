const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
//const cors = require('cors')({origin: true});
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({ origin: true }));


const db = admin.firestore();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rayen.generalinox.com@gmail.com',
        pass: 'RAYENKACEM123***'
    }
});
/**
* Here we're using Gmail to send 

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
        const name = req.query.name;

        const mailOptions = {
            from: 'kacemrayen13@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'I\'M A ' +  name +' !!!!!', // email subject
            html: `<p style="font-size: 16px;"></p>
                <br />
                <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
            ` // email content in HTML
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});
*/

/***  post new defind email ***/

app.post('/email', (req, res) => {
    (async () => {
        try {
           
            await  db.collection('emails').doc().create(
              { 
          
                title : req.body.title,
                description : req.body.description,
                default : 'true'
           
            });
      
           return res.status(200).send();
        
         } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });

  /***** get all defind email ******/

app.get('/email/read',(req,res) => {
    (async () => {
        try {
            let query = db.collection('emails');
            
            let response = [];
           
            await query.where('default', '==', 'true').get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedProspect = {
                        id: doc.id,
                        title: doc.data().title,
                        description: doc.data().description,
                        
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

  /*******  get one defaut email   ******/
  app.get('/api/read/:emailid', (req, res) => {
    (async () => {
        try {
            const document = db.collection('emails').doc(req.params.emailid);
            let prospect = await document.get();
            let response = { data : prospect.data(),
                            id: req.params.emailid};
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

/****  update *****/
app.put('/email/update/:emailId', (req, res) => {
    (async () => {
        try {
            const document = db.collection('emails').doc(req.params.emailId);
            await document.update({
               
                dest: req.body.dest,
                title  : req.body.title,
                description : req.body.description
            });
            const dest = req.body.dest;
            const title  = req.body.title ;
            const description = req.body.description;
          
          

            const mailOptions = {
                from: 'kacemrayen13@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
                to: dest,
                subject: title, // email subject
                html:  description 
            };
      
            // returning result
            return transporter.sendMail(mailOptions, (erro, info) => {
                if(erro){
                    return res.send(erro.toString(),doc.data().title, doc.data().description);
                }
            });
          //  return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
    


app.post('/sendMail', (req, res) => {
    (async () => {
        try {
           
            await  db.collection('emails').doc().create(
              { 
              dest : req.body.dest,
              title : req.body.title,
              description : req.body.description,
              name : req.body.name
            });
          const dest = req.body.dest;
          const title  = req.body.title ;
          const description = req.body.description;
          const name = req.body.name;
          
            const mailOptions = {
                from: 'kacemrayen13@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
                to: dest,
                subject: title, // email subject
                html:  description 
            };
      
            // returning result
            return transporter.sendMail(mailOptions, (erro, info) => {
                if(erro){
                    return res.send(erro.toString());
                }
            });
           // return res.status(200).send();
        
         } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });


  exports.emailApi= functions.https.onRequest(app);