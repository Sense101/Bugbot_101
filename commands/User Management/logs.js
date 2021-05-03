const fs = require('fs');
const { Message, Collection, Client } = require(`discord.js`);


module.exports = {
    name: `logs`,
    usage: `|user id| |log name?|`,
    description: `Use to access the logs of a user.`,

    permission: `MANAGE_MESSAGES`,
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async (msg, args) => {
        //array of the four log groups
        const { logs } = msg.client;
        
        if (!args[0]) return await msg.reply(`please provide a member id.`);

        const member = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();
        if (!member) {
            return await msg.reply(`failed to recognise that member id.`);
        }

        if (args[1]) {
            //we are checking for an individual log
            const logName = args[1].toLowerCase();

            /** @type {import('../..').LogGroup} */
            const logGroup = logs.find(l => l.id == logName);
            if (!logGroup) return await msg.reply(
                `There are no logs by that name.\n` +
                `Available logs are: mutes, warns, kicks and bans.`
            )
            //check logs for the same id
            const memberLogs = logGroup.logs.filter(l => l.memberId == member.id).map(l => l.reason);
            if(!memberLogs.length) return await msg.reply(`no ${logName} logged for ${member.displayName}.`);

            const nameAsPast = nameToPast(logName);
            const reply = `<m> has been <l> <n> time(s) for:\n`;
            reply.replace(`<m>`, member.displayName).replace(`<l>`, nameAsPast).replace(`<n>`, memberLogs.length);
            await msg.reply(reply + memberLogs.join(`, `) + `.`);
        } else {
            //we are checking all logs
            let reply = `${member.displayName} has:\n`
            for (let i = 0; i < logs.length; ++i) {
                
                /** @type {import('../..').LogGroup} */
                const logGroup = logs[i];
                const nameAsPast = nameToPast(logGroup.id);
                const memberLogs = logGroup.logs.filter(l => l.memberId == member.id).map(l => l.reason);
                if (!memberLogs.length) {
                    reply += `Never been ${nameAsPast}.\n`;
                    continue;
                }
                reply += `Been ${nameAsPast} ${memberLogs.length} time(s) for: ${memberLogs.join(`, `)}.\n`;
            }
            await msg.reply(reply);
        }
	},

    /**
     * Adds a log and saves it to json
     * @param {string} memberId 
     * @param {string} logId 
     * @param {string} reason 
     * @param {Client} client 
     * @returns {boolean} success
     */
    addLog(memberId, logId, reason, client) {
        const { logs } = client;
        
        /** @type {import('../..').LogGroup} */
        const logGroup = logs.find(l => l.id == logId);
        logGroup.logs.push({ memberId: memberId, reason: reason });

        fs.writeFileSync("logs.json", JSON.stringify(logs));
    },
};

/**
 * 
 * @param {string} name 
 */
function nameToPast(name) {
    switch (name) {
        case `mutes`:
            return `muted`;
        case `warns`:
            return `warned`;
        case `kicks`:
            return `kicked`;
        case `bans`:
            return `banned`;
        default:
            return `undefined`;
    }
}