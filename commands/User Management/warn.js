const { Message } = require(`discord.js`);
const { addLog } = require("./logs");

module.exports = {
    name: `warn`,
    usage: `|user| |reason?|`,
    description: `Use to warn users when they are doing something against the rules.`,

    permission: `MANAGE_MESSAGES`,

    argsEnd: 1,
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async ( msg, args) => {
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return msg.reply("please @mention who you want to warn.")

        const reason = args[1] || `no reason specified`;
        addLog(member.id, `warns`, reason, msg.client);

        await member.send(`You were warned on ${msg.guild.name}. Reason: ${reason}.`);
	},
};