const File = require('../models/File');
const cloudinary = require('cloudinary').v2;

// localFileUpload --> handler function

exports.localFileUpload = async (req, res) => {
    try{
        // fetch file
        const file = req.files.file;
        console.log('FILE -->', file);

        // create path where file need to be stored on server
        let path = __dirname + '/files/' + Date.now() + `.${file.name.split('.')[1]}`;
        console.log('PATH -->', path);

        // add path to the move function
        file.mv(path, (err) =>{
            console.log(err);
        });

        // create a successful response
        res.json({
            success:true,
            message:'Local File Uploaded Successfully',
        });
    }
    catch(error){
        console.log(error);
    }
}

function isFileTypeSupported(fileType, supportedTypes) {
    return supportedTypes.includes(fileType);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = {folder};
    console.log("temp file path", file.tempFilePath);
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload handler
exports.imageUpload = async (req, res) => {
    try{
        // data fetch
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const imageFile = req.files.imageFile;
        console.log(imageFile);

        // validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = imageFile.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:'File formate not supported',
            })
        }

        // file formate is uploaded
        const response = await uploadFileToCloudinary(imageFile, "My_Folder");
        console.log(response);

        // save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Successfully Uploaded',
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something Went Wrong',
        })
    }
}

// video upload
exports.videoUpload = async (req, res) => {
    try{
        // data fetch
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const file = req.files.videoFile;

        // validation
        const supportedTypes = ["mp4","mkv","mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("FileType -->",fileType);

        // TODO: add a upper limit of 5MB for video
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        // file format supported
        console.log('Uploading to My_Folder');
        const response = await uploadFileToCloudinary(file, "My_Folder");
        console.log(response);

        // save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            message:'Video Successfully Uploaded',
            imageUrl:response.secure_url,
        })
    }
    catch(error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something Went Wrong',
        })
    }
}

// image size reducer
exports.imageSizeReducer = async (req, res) => {
    try{
        // data fetch
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;

        // validation
        const supportedTypes = ["mp4","mkv","mov","jpg","jpeg","png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("FileType -->",fileType);

        // TODO: add a upper limit of 5MB for video
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        // file format supported
        console.log('Uploading to My_Folder');
        const response = await uploadFileToCloudinary(file, "My_Folder", 90);
        console.log(response);

        // save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            message:'file Successfully Uploaded',
            imageUrl:response.secure_url,
        })
    }
    catch(error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something Went Wrong',
        })
    }
}