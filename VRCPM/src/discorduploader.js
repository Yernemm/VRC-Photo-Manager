const discordjs = require("discord.js");

this.startWebhook = (url) => {
    const webhookClient = new discordjs.WebhookClient({url: url});
    this.webhook = webhookClient;
}

this.uploadImage = (imagePath, vrcName, vrcWorld, date) => {
    this.webhook.send({
        username: vrcName + " (VRChat)",
        content: "New photo by " + vrcName + " in " + vrcWorld + " <t:" + date + ":R>",
        files: [{
            
            attachment: imagePath,
            name: + new Date() + ".png"
        }]
    });
}

console.log(Math.floor(new Date() / 1000));

module.exports = this;