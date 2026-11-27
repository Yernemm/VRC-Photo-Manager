const qrCodeReader = require('qrcode-reader/dist/index.js');
        // __ Importing jimp __ \\
const { Jimp } = require("jimp");
const fs = require('fs')
const scan = (image, callback) => {

    const buffer = fs.readFileSync(image);

    Jimp.read(buffer).then((img) => {
        const qrCodeInstance = new qrCodeReader();

        qrCodeInstance.callback = function(err, value) {
            if (err) {
                console.error(err);
            }
            callback(err ? null : value.result);
        };

        qrCodeInstance.decode(img.bitmap);
    }).catch((err) => {
        console.error(err);
        callback(null);
    });
}

module.exports = {scan};
