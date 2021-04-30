const fs = require('fs');
const { Message } = require(`discord.js`);


module.exports = {
    name: `clearlogs`,
    usage: `{user id} {log name} {log index?}`,
    description: `Use to clear user logs.`,

    permission: `MANAGE_MESSAGES`,
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async (msg, args) => {
        const { logs } = msg.client;
        
        const id = args[0];
        if (!id) return await msg.reply(
            `please provide a member id.`
        );

        const member = msg.guild.members.cache.get(id) || msg.mentions.members.first();
        if (!member) return await msg.reply(
            `failed to recognise that member id.`
        );
        
        if (args[1]) {
            //we are checking for one type of log
            const logName = args[1].toLowerCase();

            /** @type {import('../..').LogGroup} */
            const logGroup = logs.find(l => l.id == logName);
            if (!logGroup) return await msg.reply(
                `there are no logs by that name.\n` +
                `Available logs are: mutes, warns, kicks and bans.`
            )
            const memberLogs = logGroup.logs.filter(l => l.memberId == member.id);

            const logIndex = parseInt(args[2]);
            if (logIndex && !isNaN(logIndex)) {
                if (logIndex >= memberLogs.length) return await msg.reply(
                    `${member.displayName} has no ${logGroup.id} at that index`
                );
                const deletedLog = memberLogs.splice(logIndex, 1)[0];
                await msg.reply(`'${deletedLog}' has been removed from ${member.displayName}'s ${logName}.`)
            } else {
                //clear all of this log
                const newLogs = logGroup.logs.filter(l => l.memberId != member.id);
                logGroup.logs = newLogs;
                await msg.reply(`all ${logName} cleared for ${member.displayName}.`)
            }
        } else {
            await msg.reply(
                `please provide a log type to clear.\n` +
                `Available logs are: mutes, warns, kicks and bans.`
            )
        }
        
        fs.writeFileSync("logs.json", JSON.stringify(logs));
	},
};