const { Message } = require(`discord.js`);
const { addLog } = require("./logs");

module.exports = {
    name: `mute`,
    guild: `shapez.io Modding Server`,
    permission: `MANAGE_MESSAGES`,
    argsEnd: 2,
    usage: `{user} {time in minutes} {reason?}`,
    description: `Someone spamming? With this, you can shut them up!`,
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async ( msg, args) => {
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return await msg.reply("please @mention who you want to mute.")
        
        if (!args[1]) return await msg.reply(`I need to know how long for.`);

        if (member.roles.highest.position >= msg.guild.me.roles.highest.position) {
            return await msg.reply(`I don't have permission to change the roles of that user.`);
        }
        
        await member.roles.add(`834786930403180574`);
        
        setInterval(() => removeMute(member, msg), parseInt(args[1]) * 60000);

        const reason = args[2] || `no reason specified`;
        await member.send(
            `You were muted on ${msg.guild.name} for ${args[1]} minute(s).\n` +
            `Reason: ${reason}.\nYou can still talk in #muted.`
        );
        addLog(member.id, `mutes`, reason, msg.client);
	},
};

async function removeMute(member, msg) {
    if (member.roles.cache.has(`834786930403180574`)) {
        await member.roles.remove(`834786930403180574`);
        await member.send(`You are unmuted on ${msg.guild.name}.`);
    }
}