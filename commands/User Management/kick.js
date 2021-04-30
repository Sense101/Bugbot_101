const { Message } = require(`discord.js`);
const { addLog } = require("./logs");

module.exports = {
    name: `kick`,
    usage: `{user} {reason?}`,
    permission: `MANAGE_MESSAGES`,
    argsEnd: 1,
    description: `Close the door behind you.`,
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async ( msg, args) => {
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return await msg.reply("please @mention who you want to kick.")

        const kickable = !member.hasPermission(`MANAGE_MESSAGES`);
        if (!kickable) return await msg.reply("seems I can't kick that user.")
        
        const reason = args[1] || `no reason specified`;
        addLog(member.id, `kicks`, reason, msg.client);

        await member.send(`You were kicked from ${msg.guild.name}. Reason: ${reason}.`);
        await member.kick(reason);
	},
};