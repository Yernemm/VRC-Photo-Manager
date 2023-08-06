const qrCodeReader = require('qrcode-reader');
        // __ Importing jimp __ \\
const Jimp = require("jimp");
const scan = (image, callback) => {


    // __ Importing filesystem = __ \\
    const fs = require('fs')

    // __ Importing qrcode-reader __ \\
    
    
    // __ Read the image and create a buffer __ \\
    const buffer = fs.readFileSync(image);
    
    // __ Parse the image using Jimp.read() __ \\
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
        }
    // __ Creating an instance of qrcode-reader __ \\

        const qrCodeInstance = new qrCodeReader();

        qrCodeInstance.callback = function(err, value) {
            if (err) {
                console.error(err);
            }
    // __ Printing the decrypted value __ \\
            //console.log(value.result);
            callback(err ? null : value.result);
        };

    // __ Decoding the QR code __ \\
        qrCodeInstance.decode(image.bitmap);
    });
}     

module.exports = {scan};
