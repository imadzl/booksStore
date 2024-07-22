const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://admin:admin@cluster0.vqohxqq.mongodb.net/Ecommerce");

// API Creation
app.get("/",(req,res)=>{
    res.send("Express App is Runnuing")
})

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    ratingsCount: {
        type: Number,
        default: 0
    },
    description: {
        type:String,
        required:true,
    }
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if (products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        description:req.body.description,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for deleting Products
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for modify product
app.post('/modifyproduct',async (req,res)=>{
    const { id, old_price, new_price } = req.body;
    try {
        const modProd = await Product.findOne({id});
        modProd.old_price = old_price;
        modProd.new_price = new_price;
        await modProd.save();
        res.json(modProd);
        console.log("Modified");
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
})

// Creating API for getting all Products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating Endpoint for regestring the user
app.post('/signup',async (req,res)=>{

    if (req.body.username === "") {
        return res.status(400).json({success:false,errors:"The Name field is empty"});
    }
    if (req.body.email === "") {
        return res.status(400).json({success:false,errors:"The Email field is empty"});
    }
    if (req.body.password === "") {
        return res.status(400).json({success:false,errors:"The Password field is empty"});
    }
    let check = await Users.findOne({email:req.body.email});
    if(check) {
        return res.status(400).json({success:false,errors:"Existing user found with same email address"});
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// Creating Endpoint for user login
app.post('/login', async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email ID"})
    }
})

// Creating Endpoint for newcollection data
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log('NewCollection Fetched');
    res.send(newcollection);
})

// Creating Endpoint for Popular in Fiction data
app.get('/popularinfictoin',async (req,res)=>{
    let products = await Product.find({category:"Fiction"});
    let popular_in_women = products.slice(0,4);
    console.log('Popular in Fiction Fetched');
    res.send(popular_in_women);
})

// Creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else {
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Please authenticate using valid token2"})
        }
    }
}

// Creating Endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

// Creating Endpoint for remove products from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

// Creating Endpoint for empty products from cartdata
app.post('/emptycart',fetchUser,async (req,res)=>{
    console.log("Emptied",req.user.id);
    let userData = await Users.findOne({_id:req.user.id});
    for (let index = 0; index < 299; index++) {
        if(userData.cartData[index]>0)
            userData.cartData[index] = 0;
    }
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Emptied")
})

// Creating Endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

// Schema for reviews
const Review = mongoose.model('Review', {
    productId: {
        type: Number,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

 // Calculate reviews
async function updateAverageRating(productId) {
    const reviews = await Review.find({ productId });
    const averageRating = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length || 0;
    const ratingsCount = reviews.length;

    await Product.findOneAndUpdate(
        { id: productId },
        { averageRating: averageRating, ratingsCount: ratingsCount }
    );
}   

// add review
app.post('/addReview', fetchUser, async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userE = await Users.findOne({_id:req.user.id})
    const userEmail = userE.email;
    const username = userE.name;
    

    try {
        let review = await Review.findOne({ productId, userEmail });
        if (review) {
            // Update existing review
            review.rating = rating;
            review.comment = comment;
            await review.save();
        } else {
            // Create new review
            review = new Review({
                productId,
                userEmail,
                username,
                rating,
                comment
            });
            await review.save();
        }
        await updateAverageRating(productId);
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: "Error processing review", error });
    }
});



// modify review
app.put('/modifyReview', fetchUser, async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userE = await Users.findOne({_id:req.user.id})
    const userEmail = userE.email; 
    const username = userE.name;

    try {
        const review = await Review.findOneAndUpdate(
            { productId, userEmail },
            { rating, comment },
            { new: true }
        );

        if (review) {
            await updateAverageRating(productId);
            console.log("Review modified", productId);
            res.json(review);
        } else {
            res.status(404).json({ message: "Review not found or you do not have permission to modify it." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error });
    }
});


/*
// Creating API for MODIFY
app.post('/removeproduct',async (req,res)=>{
    const { id, old_price, new_price } = req.body;
    try {
        const modProd = await Review.findOneAndUpdate(
            { id },
            { old_price, new_price },
            { new: true }
        );
        if (modProd) {
            console.log("Product modified", id);
            res.json(modProd);
        } else {
            res.status(404).json({ message: "Product not found" });
        }

        await Product.findOneAndDelete({id:req.body.id});
        console.log("Removed");
        res.json({
            success:true,
            name:req.body.name,
        })
        
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
})
*/


// delete review
app.delete('/deleteReview', fetchUser, async (req, res) => {
    const { productId } = req.body;
    console.log(typeof productId);
    console.log(productId);
    const userE = await Users.findOne({_id:req.user.id})
    const userEmail = userE.email; 
    console.log(userEmail);
    

    try {
        const result = await Review.findOneAndDelete({ productId, userEmail });
        if (result) {
            await updateAverageRating(productId);
            console.log("Review deleted", productId);
            res.json({ message: "Review deleted successfully" });
        } else {
            res.status(404).json({ message: "Review not found or you do not have permission to delete it." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error });
    }
});


// get reviews
app.get('/reviews/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Fetch all reviews where the productId matches the given parameter
        const reviews = await Review.find({ productId: parseInt(productId) });
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this product." });
        }
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
});

app.listen(port,(err)=>{
    if (!err) {
        console.log("Server is running on port "+port)
    }
    else{
        console.log("Error : "+err)
    }
})