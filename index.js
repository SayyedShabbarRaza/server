require('dotenv').config();
const express=require("express")
const mongoose=require("mongoose")
const app=express()
const product = require("./product");
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to mongodb");

        //API's here
        
//post api
app.post("/api/add_product",async (req, res) => {
    console.log("Result", req.body);

    let data=product(req.body);

    try{
        let dataToStore=await data.save();
        console.log("data is being sent");
       res.status(200).json(dataToStore); 

    }catch(e){
        res.status(400).json({
            'status':e.message
        })
    }
});

//Get api

app.get("/api/get_product",async (req, res) => {

    try{
        let data=await product.find();
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }

});

//Update api
app.patch("/api/update/:id",async (req, res) => {

let id = req.params.id;
let updatedData=req.body;
let options={new:true};

try{
    const data=await product.findByIdAndUpdate(id,updatedData,options);

    res.send(data);
}catch(e){
    res.send(e.message);
}

})

//delete api
app.delete("/api/delete/:id",async (req, res) => {

let id =req.params.id;

try{
   const data= await product.findByIdAndDelete(id);
   res.json({
    'status':"Deleted the product ${data,pname} form database"
   })
}catch(e){
    res.json(e.message);
}
})


}).catch(()=>{
    console.log("failed to connect to mongodb");
})

const PORT = process.env.PORT || 2000;
app.listen(PORT,()=>{
console.log("server is running");
});

