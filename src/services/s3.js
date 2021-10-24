
const AWS = require('aws-sdk');
var fs = require('fs');
require('dotenv').config()

const options = {
    apiVersion: '2012-10-17',
    params: {
        Bucket: process.env.AWS_BUCKET_NAME
    },
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4'
}

const s3 = new AWS.S3(options);

async function generateUploadURL(dni, token) {
    var fileContent = token;
    var filepath = "src/documents/" + dni + ".txt";
    fs.writeFile(filepath, fileContent, (err) => {
        if (err) throw err;

        console.log("The file was succesfully saved!");
    });
    var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fs.createReadStream(filepath),
        Key: filepath
    };

    s3.upload(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        }

        if (data) {
            console.log("Uploaded in:", data.Location);
        }
    });
}

module.exports.generateUploadURL = generateUploadURL;