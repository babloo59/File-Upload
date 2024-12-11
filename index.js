// app create
const express = require('express');
const app = express();

// finding Port
require('dotenv').config();
const PORT = process.env.PORT || 3000

// Add Middleware
app.use(express.json());
const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles:true,
    tempFileDir: '/tmp'
}
));

// DB connection 
const db = require('./config/database');
db.connect();

// cloudinary connection
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

// api route mounting
const Upload = require('./routes/FileUpload');
app.use('/api/v1/upload', Upload);

// server Activation
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})