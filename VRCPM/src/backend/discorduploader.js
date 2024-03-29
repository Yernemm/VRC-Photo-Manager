const discordjs = require("discord.js");
const main = require("./main");
const qr = require("./qr");

this.startWebhook = (url) => {

    let webhookClient;
    try{
        webhookClient = new discordjs.WebhookClient({url: url});
    }catch(e){
        //main.log("[DU] \u001b[31mERROR ERROR ERROR\u001b[0m");
        //main.log("[DU] Error starting webhook. Please restart VRCPM and paste a working webhook URL.");
        main.error("D-001", "Error starting webhook. Please restart VRCPM and paste a working webhook URL.");
    }
    
    this.webhook = webhookClient;
    main.log("[DU] Webhook started");
}

this.uploadImage = (imagePath, vrcName, vrcWorld, vrcWorldId, date, moreInfo = null) => {
    let whcontent = "New photo by " + vrcName + " in " + vrcWorld + " <t:" + date + ":R>\n<https://vrchat.com/home/world/" + vrcWorldId + ">";

    if(moreInfo)
        whcontent += "\n" + moreInfo;

    main.log("[DU] Uploading image to webhook\n" + whcontent);

    qr.scan(imagePath, (qrRes)=>{
        let qrDesc = ""
        if(qrRes){
            qrDesc = "\n**[QR Scan]**: " + qrRes;
        }

        
    this.webhook.send({
        username: vrcName + " (VRChat)",
        content: whcontent + qrDesc,
        files: [{
            
            attachment: imagePath,
            name: + new Date() + ".png"
        }]
    })
    .catch(e =>{
        main.error("D-002", e)
        //main.log("[DU] \u001b[31mERROR ERROR ERROR\u001b[0m");
        //main.log("[DU] Error uploading image to webhook. Please restart VRCPM and paste a working webhook URL.");
        main.error("D-002", "Error uploading image to webhook. Please restart VRCPM and paste a working webhook URL.");
    });

    })

}

console.log(Math.floor(new Date() / 1000));

module.exports = this;