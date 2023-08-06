const qrCodeReader = require('qrcode-reader');
        // __ Importing jimp __ \\
const Jimp = require("jimp");
const fs = require('fs')
const scan = (image, callback) => {

    const buffer = fs.readFileSync(image);
    
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
        }
        const qrCodeInstance = new qrCodeReader();

        qrCodeInstance.callback = function(err, value) {
            if (err) {
                console.error(err);
            }
            callback(err ? null : value.result);
        };

        qrCodeInstance.decode(image.bitmap);
    });
}     

module.exports = {scan};
