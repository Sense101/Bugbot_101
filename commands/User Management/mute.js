const { Message, GuildMember } = require(`discord.js`);
const { addLog } = require("./logs");

module.exports = {
    name: `mute`,
    guild: `shapez.io Modding Server`,
    permission: `MANAGE_MESSAGES`,
    argsEnd: 2,
    usage: `{user} {time in minutes} {reason?}`,
    description: `Someone spamming? With this, you can shut them up!`,
    
    execute(/** @type {Message}*/ msg, args) {
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return msg.reply("please @mention who you want to mute.")

        if (member.roles.highest.position >= msg.guild.me.roles.highest.position) {
            return msg.reply(`I don't have permission to change the roles of that user.`);
        }
        
        member.roles.add(`834786930403180574`);
        let notif = `You were muted on ${msg.guild.name}`;
        if (!args[1]) return msg.reply(`I need to know how long for.`);
        
        setInterval(() => removeMute(member, msg), parseInt(args[1]) * 60000);
        notif += ` for ${args[1]} minute(s)`;

        const reason = args[2] || `no reason specified`;
        notif += `.\nReason: ${reason}.\nYou can still talk in #muted.`
        member.send(notif);
        addLog(member.id, `mutes`, reason, msg.client);
	},
};

function removeMute(/** @type {GuildMember} */member, msg) {
    if (member.roles.cache.has(`834786930403180574`)) {
        member.roles.remove(`834786930403180574`);
        member.send(`You are unmuted on ${msg.guild.name}`);
    }
}