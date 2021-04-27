const { Message } = require(`discord.js`);

module.exports = {
    name: `unmute`,
    guild: `shapez.io Modding Server`,
    permission: `MANAGE_MESSAGES`,
    usage: `{user}`,
    description: `Use this to unmute an innocent user.`,
    
    execute(/** @type {Message}*/ msg, args) {
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return msg.reply("please @mention who you want to unmute.")
        
        member.roles.remove(`834786930403180574`);
        member.send(`You have been unmuted on ${msg.guild.name}`);

	},
};