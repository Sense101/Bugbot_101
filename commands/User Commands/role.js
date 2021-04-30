const { Message, Guild, MessageEmbed } = require("discord.js");
const { prefix } = require(`../../config.json`);

module.exports = {
    name: `role`,
    aliases: [`roles`],
    channels: ["role-commands", "bot-testing"],
    usage: `{role} {role} ...`,
    description: `Gives or removes roles. Send ${prefix}role to see all available roles.`,
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async (msg, args) => {
        const member = msg.member;

        if (!args.length) return await msg.reply(this.getRoleEmbed(msg.guild));

        let reply = `${member}\n`;
        for (let i = 0; i < args.length; ++i) {
            const noPing = args[i].replace(/>/g, `\\>`);

            //check if the role exists
            const role = msg.guild.roles.cache.filter(r => r.name != "@everyone")
                .find(r => r.name.toLowerCase() === args[i].toLowerCase());
            if (!role) {
                reply += `${noPing} role doesn't exist.\n`;
                continue;
            }
            const rolename = role.name;

            //check if the user has permission
            const isAdmin = member.hasPermission("ADMINISTRATOR");
            if (!isAdmin && (role.hexColor != `#000000` || role.managed)) {
                reply += `Unable to give you ${rolename} role.\n`;
                continue;
            }

            //check if the bot has permission
            if (role.position >= msg.guild.me.roles.highest.position) {
                reply += `Unable to give you ${rolename} role.\n`;
                continue;
            }

            if (member.roles.cache.some(r => r === role)) {
                member.roles.remove(role);
                reply += `Removed you from ${rolename}.\n`;
            } else {
                member.roles.add(role);
                reply += `Added you to ${rolename}.\n`;
            }
        }
        await msg.channel.send(reply);
    },

    async getRoleEmbed(/** @type {Guild} */ guild) {
        const roles = guild.roles.cache.array().filter(r => r.hexColor == `#000000`)
            .filter(r => r.name != "@everyone" && !r.managed);
        const names = roles.map(r => r.name);

        const roleEmbed = new MessageEmbed()
            .setColor(guild.me.displayHexColor)
            .setTitle(`Available Roles`)
            .setDescription(`Add the role names after the role command. Not case-sensitive.`);
        roleEmbed.addField("Mod Discussion Roles", `*` + names.join(`*, *`) + `*`, true);
        return roleEmbed;
    }
};