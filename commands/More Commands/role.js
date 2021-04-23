const { Message } = require("discord.js");

module.exports = {
    name: `role`,
    channel: "bot-commands",
    usage: `[role]`,
    description: `Gives or removes the role from the user, if they are allowed it\nReaction roles coming soon!`,
    
    execute(/** @type {Message}*/ msg, /** @type {string[]}*/ args) {
        const member = msg.member;

        if (!args[0]) return msg.reply(`please specify a role`);

        //check if the role exists
        const role = msg.guild.roles.cache.find(r => r.name === args[0]);
        if (!role) return msg.reply(`that role does not exist.`);

        //check if the user has permission
        const isAdmin = member.hasPermission("ADMINISTRATOR");
        if (!isAdmin && role.hexColor != `#000000`) {
            return msg.reply(`you don't have permission to do that.`);
        }
        
        //check if the bot has permission
        if (role.position >= msg.guild.me.roles.highest.position) {
            return msg.reply(`that role is above my highest role!`);
        }
        
        if (member.roles.cache.some(r => r === role)) {
            member.roles.remove(role);
            msg.reply(`removed you from ${args[0]}.`);
        } else {
            member.roles.add(role);
            msg.reply(`added you to ${args[0]}.`);
        }
        
	},
};