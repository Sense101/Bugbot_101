const { Message } = require(`discord.js`);

module.exports = {
    name: `clearlogs`,
    usage: `[log] [member id]`,
    permission: `MANAGE_MESSAGES`,
    description: `Removes the specified logs of the user`,
    
    execute(/** @type {Message}*/ msg, args) {
        const { logs } = msg.client;

        const id = args[0];
        if (!id) return msg.reply(`please provide a member id.`);
        if (!msg.guild.members.cache.some(m => m.id === id)) {
            return msg.reply(`failed to recognise that id.`);
        }

        if (!logs.get(id).has(args[1] || ``)) {
            return msg.reply(`that log either does not exist or is empty.`);
        }
        const warns = logs.get(id).delete(args[1]);
        return msg.reply(`logs succesfully deleted.`);
	},
};