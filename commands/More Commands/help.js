const { Message, MessageEmbed } = require(`discord.js`);
const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    usage: ``,
    cooldown: 15,
    channel: `bot-commands`,
	description: 'Lists all available commands and how to use them.',
	aliases: ['commands'],
	execute(/** @type {Message}*/ msg, args) {
        const { commands } = msg.client;

        const allAvailable = msg.member.hasPermission("MANAGE_MESSAGES");
        let availableCommands = commands.array();

        if (!allAvailable) {
            for (let i = 0; i < availableCommands.length; ++i) {
                if (availableCommands[i].permission) {
                    availableCommands.splice(i, 1);
                    i--;
                }
            }
        }

        if (!args[0]) {
            const helpEmbed = new MessageEmbed().setTitle('Available Commands')
                .setDescription(`type ${prefix} before a command to run it.`)
                .setFooter(`Send \'${prefix}help [command name]\' to get info on a specific command!`)
                .setColor(msg.guild.me.roles.highest.hexColor);

            for (let i = 0; i < availableCommands.length; ++i) {
                const command = availableCommands[i];
                helpEmbed.addField(`${command.name} ${command.usage || ""}`, command.description);
            }
            msg.channel.send(helpEmbed);
        } else {
            const command = availableCommands.find(cmd => cmd.name === args[0])
            if (!command) return msg.reply(`invalid command.`);
            
            const helpEmbed = new MessageEmbed().setTitle(prefix + command.name)
                .addField(`${command.name} ${command.usage || ``}`, command.description);
            msg.channel.send(helpEmbed);
        }
    },
};