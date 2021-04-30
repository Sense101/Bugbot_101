const { Message, MessageEmbed } = require(`discord.js`);
const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    usage: `{command?}`,
    description: 'Gives information about the commands you can use.',
    
    channels: [`role-commands`, `bot-testing`],

    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
	execute: async (msg, args) => {
        const { commands } = msg.client;

        const isAllAvailable = msg.member.hasPermission("MANAGE_MESSAGES");
        let availableCommands = commands.array();

        if (!isAllAvailable) {
            for (let i = 0; i < availableCommands.length; ++i) {
                if (availableCommands[i].permission) {
                    availableCommands.splice(i, 1);
                    i--;
                }
            }
        }

        if (!args[0]) {
            const helpEmbed = new MessageEmbed()
                .setTitle('Available Commands')
                .setDescription(`*type ${prefix} before a command to run it.*`)
                .setFooter(`Send '${prefix}help {command name}' to get info on a specific command!`)
                .setColor(msg.guild.me.roles.highest.color);

            let text = ``;
            for (let i = 0; i < availableCommands.length; ++i) {
                const command = availableCommands[i];
                const usage = ` ` + command.usage || ``;
                
                for (let i = 0; i < command.aliases ? command.aliases.length : 0; ++i) {
                    text += `\n` + command.aliases[i] + usage;
                }
                text += `\n\n` + command.name + usage;
            }
            helpEmbed.addField(`Commands`, text);
            await msg.channel.send(helpEmbed);
        } else {
            const command = availableCommands.find(cmd => cmd.name === args[0])
            if (!command) return msg.reply(`invalid command.`);
            
            const helpEmbed = new MessageEmbed()
                .setTitle(prefix + command.name)
                .addField(`${command.name} ${command.usage || ``}`, command.description);
            await msg.channel.send(helpEmbed);
        }
    },
};