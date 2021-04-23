const { Message } = require(`discord.js`);

module.exports = {
    name: `logs`,
    usage: `[member id] [log type]`,
    permission: `MANAGE_MESSAGES`,
    description: `Accesses the logs of the user`,
    
    execute(/** @type {Message}*/ msg, args) {
        const { logs } = msg.client;

        const id = args[0];
        if (!id) return msg.reply(`please provide a member id.`);
        if (!msg.guild.members.cache.some(m => m.id === id)) {
            return msg.reply(`failed to recognise that id.`);
        }

        if (!logs.get(id).has(args[1] || ``)) {
            return msg.reply(`That log either does not exist or has never been used for that member.`);
        }
        const warns = logs.get(id).get(args[1]);
        const warnsAsString = warns.toString().replace(/,/g, `, `);
        return msg.reply(`That member has been warned ${warns.length} time(s).\nFor: ${warnsAsString}`);
	},
};