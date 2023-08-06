const jsQR = require('jsqr');
const Jimp = require("jimp");
const fs = require('fs')
const { get, getSync } = require('@andreekeberg/imagedata')

const scan = (image, callback) => {


    get(image, (error, data) =>{
        if(!error){

        
        const code = jsQR(data.data, data.width, data.height);

        console.log(data);
        console.log(code)
    
        callback(code ? code.data : null)
        }else{
            callback(null)
        }
    })



}     


module.exports = {scan};
