const { Message, Collection } = require(`discord.js`);

module.exports = {
    name: `warn`,
    usage: `[member] [reason]`,
    permission: `MANAGE_MESSAGES`,
    argsEnd: 1,
    cooldown: 10,
    description: `Warns the user and adds the warning to the logs`,
    
    execute(/** @type {Message}*/ msg, args) {
        const { logs } = msg.client;
        const member = msg.mentions.members.first();
        if (!member) return msg.reply("please @mention who you want to warn.")

        /** @type {string[]}*/
        let currentWarns = [];
        if (!logs.has(member.id)) {
            logs.set(member.id, new Collection());
        }
        const memberLogs = logs.get(member.id);
        if (memberLogs.has("warns")) {
            currentWarns = memberLogs.get("warns");
        }
        const reason = args[1] || `no reason whatsoever`;
        currentWarns.push(reason);
        memberLogs.set(member.id, currentWarns);

        member.send(`You were warned on ${msg.guild.name} for ${reason.toLowerCase()}.`);
	},
};