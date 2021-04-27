const { Message } = require(`discord.js`);

module.exports = {
    name: `clear`,
    permission: `MANAGE_MESSAGES`,
    usage: `{number to clear}`,
    description: `Clears the specified number of messages from the channel.`,
    
    execute(/** @type {Message}*/ msg, args) {
        const amount = math.max(parseInt(args[0]) + 1, 11);
        if (isNaN(amount)) {
		    return msg.reply('please specify an amount to clear');
        }
        console.log(`clearing ${amount - 1} message(s)`)
        msg.channel.bulkDelete(amount);
	},
};