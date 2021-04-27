const { Message, GuildMember } = require(`discord.js`);
const { addLog } = require("./logs");

module.exports = {
    name: `ban`,
    usage: `{user} {reason?}`,
    permission: `MANAGE_MESSAGES`,
    argsEnd: 1,
    description: `The ban hammer shows no mercy.`,
    
    execute(/** @type {Message}*/ msg, args) {
        /** @type {GuildMember} */
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return msg.reply("please @mention who you want to ban.");

        const bannable = !member.hasPermission(`MANAGE_MESSAGES`);
        if (!bannable) return msg.reply("seems I can't ban that user.");

        const reason = args[1] || `no reason specified`;
        addLog(member.id, `bans`, reason, msg.client);
        const notif = [
        `You are permanently banned from ${msg.guild.name}. Reason: ${reason}.`,
        `If you feel your ban was unfair, or want to appeal, message a mod on the main server.`
        ].join("\n");

        member.send(notif).then(() => {
            member.ban(reason);
        });
	},
};

