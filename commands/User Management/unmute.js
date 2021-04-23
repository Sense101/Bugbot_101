const { Message } = require(`discord.js`);

module.exports = {
    name: `unmute`,
    guild: `shapez.io Modding Server`,
    permission: `MANAGE_MESSAGES`,
    usage: `[member]`,
    description: `Unmutes the user mentioned`,
    
    execute(/** @type {Message}*/ msg, args) {
        const member = msg.mentions.members.first();
        if (!member) return msg.reply("please @mention who you want to unmute.")
        
        member.roles.remove(`834786930403180574`);
        member.send(`You are unmuted on ${msg.guild.name}`);

	},
};