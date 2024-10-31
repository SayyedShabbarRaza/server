require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const product = require("./product");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });

// API endpoints
// POST API to add a product
app.post("/api/add_product", async (req, res) => {
    console.log("Result", req.body);
    let data = new product(req.body); // Instantiate the product model

    try {
        let dataToStore = await data.save();
        console.log("Data is being sent");
        res.status(200).json(dataToStore);
    } catch (e) {
        res.status(400).json({ status: e.message });
    }
});

// GET API to retrieve products
app.get("/api/get_product", async (req, res) => {
    try {
        let data = await product.find();
        res.status(200).json(data);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).json({ error: e.message });
    }
});

// PATCH API to update a product
app.post("/api/update/:id", async (req, res) => {
    let id = req.params.id;
    let updatedData = req.body;
    let options = { new: true };

    try {
        const data = await product.findByIdAndUpdate(id, updatedData, options);
        res.status(200).json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// DELETE API to delete a product
app.post("/api/delete/:id", async (req, res) => {
    let id = req.params.id;

    try {
        const data = await product.findByIdAndDelete(id);
        res.status(200).json({ status: `Deleted the product ${data.pname} from database` });
        console.log("deleted");
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Export the Express app as a serverless function
module.exports = app;

// Optional: Listen on the specified port if running locally
if (require.main === module) {
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
        console.log("Server is running");
    });
}
