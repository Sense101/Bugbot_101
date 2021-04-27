const { Message } = require(`discord.js`);

module.exports = {
    name: `clearlogs`,
    usage: `{user id} {log name?}`,
    permission: `MANAGE_MESSAGES`,
    description: `Use to clear user logs.`,
    confirm: true,
    
    execute(/** @type {Message}*/ msg, args) {
        const { logs } = msg.client;
        
        const id = args[0];
        if (!id) return msg.reply(`please provide a member id.`);
        const member = msg.guild.members.cache.get(id) || msg.mentions.members.first();
        if (!member) {
            return msg.reply(`failed to recognise that member id.`);
        }
        // 4 things - mutes, warns, kicks, bans
        const names = [`mutes`, `warns`, `kicks`, `bans`];
        if (args[1]) {
            //we are checking for an individual log
            const logName = args[1].toLowerCase();

            if (!names.some(n => n === logName || ``)) {
                //invalid log name to check
                return msg.reply(`available logs are: mutes, warns, kicks and bans.`)
            }
            logs.get(id).clear(logName);
            fs.writeFileSync("logs.json", JSON.stringify(logs));
            return msg.reply(`${logName} cleared for ${member.displayName}.`)
        }
        logs.clear(id);
        //fs.writeFileSync("logs.json", JSON.stringify(logs));
        msg.reply(`all logs cleared for ${member.displayName}.`);
	},
};