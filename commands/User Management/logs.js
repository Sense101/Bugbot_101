const fs = require('fs');
const { Message, Collection, Client } = require(`discord.js`);

module.exports = {
    name: `logs`,
    usage: `{member id} {log name?}`,
    permission: `MANAGE_MESSAGES`,
    description: `Use to access the logs of a user.`,
    
    execute(/** @type {Message}*/ msg, args) {
        const { logs } = msg.client;
        
        if (!args[0]) return msg.reply(`please provide a member id.`);
        const member = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();
        if (!member) {
            return msg.reply(`failed to recognise that member id.`);
        }
        if (!logs.has(member.id)) {
            logs.set(member.id, new Collection());
        }
        // 4 things - mutes, warns, kicks, bans
        const names = [`mutes`, `warns`, `kicks`, `bans`];
        if (args[1]) {
            //we are checking for an individual log
            const logName = args[1].toLowerCase();
            const nameAsPast = nameToPlural(logName);

            if (!names.some(n => n === logName || ``)) {
                //invalid log name to check
                return msg.reply(`avaliable logs are: mutes, warns, kicks and bans.`)
            }
            const log = logs.get(member.id).get(logName);
            if (!log) return msg.reply(`no ${logName} logged for ${member.displayName}.`);
            return msg.reply(`${member.displayName} has been ${nameAsPast} ${log.length} time(s) for:\n${log.join(`, `)}.`)
        }
        let reply = `${member.displayName} has:\n`
        for (let i = 0; i < names.length; ++i) {
            const nameAsPast = nameToPlural(names[i]);
            const log = logs.get(member.id).get(names[i]);
            if (!log) {
                reply += `Never been ${nameAsPast}.\n`;
                continue;
            }
            reply += `Been ${nameAsPast} ${log.length} time(s) for: ${log.join(`, `)}.\n`;
        }
        msg.reply(reply);
	},

    /**
     * 
     * @param {string} memberId 
     * @param {string} logName 
     * @param {string} reason 
     * @param {Client} client 
     */
    addLog(memberId, logName, reason, client) {
        const { logs } = client;

        if (!logs.has(memberId)) {
            logs.set(memberId, new Collection());
        }

        
        /** @type {string[]}*/
        let currentLogs = [];
        const memberLogs = logs.get(memberId);
        if (memberLogs.has(logName)) {
            currentLogs = memberLogs.get(logName);
        }
        currentLogs.push(reason);
        memberLogs.set(logName, currentLogs);
        //fs.writeFileSync("logs.json", JSON.stringify(logs.keyArray()));
    }
};

/**
 * 
 * @param {string} name 
 */
function nameToPlural(name) {
    let end = `ed`;
    name = name.substring(0, name.length - 1);
    if (name.endsWith(`e`)) end = `d`;
    if (name.endsWith(`an`)) end = `ned`;
    return name + end;
}