const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


// uri connection  string
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.f6i98.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// start function----
async function run(){
    try{
        // create connect and database
        await client.connect();
        const samira_ornaments=client.db("samira_ornaments");
        const ornaments = samira_ornaments.collection("ornaments");
        const users = samira_ornaments.collection("users");
        const orders = samira_ornaments.collection("orders");
        const reviews = samira_ornaments.collection("reviews");

        // GET ornaments API 
        app.get('/ornaments', async(req, res)=>{
            const result =await ornaments.find({}).toArray();
            res.json(result)
        })

        // GET One ornament API 
        app.get('/ornaments/:id', async( req, res)=>{
            const id=req.params.id;
            const result  = await ornaments.findOne({_id:ObjectId(id)});
            res.json(result)
            
        });
        // POST API on user collection
        app.post('/users', async(req, res)=>{
            const result = await users.insertOne(req.body)
            res.json(result);
            
        });

        // POS API add new ornament
        app.post('/addCollection', async(req, res)=>{
            const result = await ornaments.insertOne(req.body);
            res.json(result);
          
        });
        
        // POST API to add order on the database
        app.post('/orders', async(req, res)=>{
           
            const result = await orders.insertOne(req.body);
            res.json(result);
            
        });

        // GET API find all orders from the database
        app.get('/allOrders', async(req, res)=>{
            const result = await orders.find({}).toArray();
            res.json(result)
            
        });
        
        // GET API find my orders from the database
        app.get('/myOrders/:email', async(req, res)=>{
            const email=req.params.email;
            const result = await orders.find({email:email}).toArray(); 
            res.json(result)
        });

        // POST API add reviews on the database 
        app.post('/reviews', async(req, res)=>{
            const result = await reviews.insertOne(req.body);
            res.json(result);

        })
        // GET API to get reviews from the database
        app.get('/reviews', async(req, res)=>{
            const result = await reviews.find({}).toArray();
            res.json(result);

        });

        // DELETE API delete order from the database
        app.delete('/orderDelete/:id', async(req, res)=>{
            const id=req.params.id; 
            const result = await orders.deleteOne({_id:ObjectId(id)})
            res.json(result);

        });

        // DELETE API myOrder form the database
        app.delete('/myOrderDelete/:id', async(req, res)=>{
            const id=req.params.id; 
            const result = await orders.deleteOne({_id:ObjectId(id)})
            res.json(result);
        });

        // PUT API update status 
        app.put('/updateStatus/:id', async(req, res)=>{
            const doc="Approve";
            const id=req.params.id;
           
            const filter={_id:ObjectId(id)};
            const result = await orders.updateOne(filter,{$set:{status:doc}});
           res.json(result)
           
        });

        // PUT API make Admin 
        app.put('/makeAdmin', async(req, res)=>{
            const email= req.body.email;
            const role=req.body.role;
            const filter={email:email}
            const result =await users.updateOne(filter,{ $set:
                {role:role}
            })
            res.json(result);
        });

        // GET API get reviews from the database
        app.get('/reviews', async(req, res)=>{
            const result= await reviews.find({}).toArray();
            res.json(result) 
        });
        
        // GET API get users from the database
        // app.get('/users/:email', async(req, res)=>{
        // const email= req.params.email;
        // console.log(email)
        // const result = await users.findOne({email:email});
        // res.json(result);
        // })
        app.get('/users/:email', async(req, res)=>{
            const email=req.params.email;
            const result = await users.findOne({email:email}); 
            let isAdmin = false;
            if(result?.role){
                isAdmin= true
            }else{
                isAdmin=false
            }
            res.json(isAdmin)
            console.log(result)
        });

        

       
        

    }
    finally {
        // await client.close();
      }

}

// called the function
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})






// pass : 1EUuBZzu0uhYtlV9
// user : samira_ornaments