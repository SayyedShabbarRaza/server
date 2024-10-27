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

// const productData = [];

mongoose.connect("mongodb+srv://syedshabbarraza207:2071975@cluster0.zdgv7.mongodb.net/crud").then(()=>{
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


    // const pdata = {
    //     "id": productData.length + 1,
    //     "pname": req.body.pname,
    //     "pprice": req.body.pprice,
    //     "pdesc": req.body.pdesc
    // };

    // productData.push(pdata);
    // console.log("Final", pdata);

    // res.status(200).send({
    //     "status_code": 200,
    //     "message": "Product added successfully",
    //     "product": pdata
    // });

});

//Get api

app.get("/api/get_product",async (req, res) => {

    try{
        let data=await product.find();
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }

    // if (productData.length > 0) {
    //     res.status(200).send({
    //         'status_code': 200,
    //         'products': productData,
    //     })
    // } else {
    //     res.status(200).send({
    //         'status_code': 200,
    //         'products': [],
    //     })
    // }
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


    // let id = req.params.id * 1;
    // let productToUpdate = productData.find(p => p.id === id);
    // let index = productData.indexOf(productToUpdate);//Logic not understood

    // productData[index] = req.body;

    // res.status(200).send({
    //     "status": "success",
    //     "message": "product updated successfully",
    // })
    
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


    // let id = req.params.id * 1;
    // let productToUpdate = productData.find(p => p.id === id);
    // let index = productData.indexOf(productToUpdate);//Logic not understood

    // productData.splice(index, 1);

    // console.log("Product deleted successfully");
    // res.status(200).send({
    //     "status": "success",
    //     'message': "Product deleted",
    // })
})


}).catch(()=>{
    console.log("failed to connect to mongodb");
})

const userSchema=new mongoose.Schema({
    name:String,
    age:Number
})

const userModel=mongoose.model("emp", userSchema);

const emp1=new userModel({
    name:"Shabbar Raza",
    age:20
    
})
emp1.save();

app.listen(2000,()=>{
console.log("server is running at 2000");
});

