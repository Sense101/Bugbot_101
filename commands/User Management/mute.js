const { Message, GuildMember } = require(`discord.js`);

module.exports = {
    name: `mute`,
    guild: `shapez.io Modding Server`,
    permission: `MANAGE_MESSAGES`,
    argsEnd: 2,
    usage: `[member] [time in minutes]`,
    description: `Mutes the user for the specified amount of time. \nIf no time is provided, the user will stay muted until unmuted.`,
    
    execute(/** @type {Message}*/ msg, args) {
        const member = msg.mentions.members.first();
        if (!member) return msg.reply("please @mention who you want to mute.")

        if (member.roles.highest.position >= msg.guild.me.roles.highest.position) {
            return msg.reply(`that member has higher permissions than me!`);
        }
        
        member.roles.add(`834786930403180574`);
        let notif = `You were muted on ${msg.guild.name}`;
        if (args[1]) {
            setInterval(() => removeMute(member), parseInt(args[1]) * 60000);
            notif += ` for ${args[1]} minute(s)`;
        }
        const reason = args[2] || `No reason specified`;
        notif += `.\nReason: ${reason}.`
        member.send(notif);
	},
};

function removeMute(/** @type {GuildMember} */member) {
    member.roles.remove(`834786930403180574`);
    member.send(`You are unmuted on ${msg.guild.name}`)
}