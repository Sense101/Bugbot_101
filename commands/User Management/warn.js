const { Message } = require(`discord.js`);
const { addLog } = require("./logs");

module.exports = {
    name: `warn`,
    usage: `{user} {reason?}`,
    permission: `MANAGE_MESSAGES`,
    argsEnd: 1,
    description: `Use to warn users when they are doing something against the rules.`,
    
    execute(/** @type {Message}*/ msg, args) {
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return msg.reply("please @mention who you want to warn.")

        const reason = args[1] || `no reason specified`;
        addLog(member.id, `warns`, reason, msg.client);

        member.send(`You were warned on ${msg.guild.name}. Reason: ${reason}.`);
	},
};