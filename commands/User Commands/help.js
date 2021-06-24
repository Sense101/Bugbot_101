const { Message, MessageEmbed } = require(`discord.js`);
const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    usage: `|command?|`,
    description: 'Gives information about the commands you can use.',
    
    channels: [`role-commands`, `bot-testing`],

    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
	execute: async (msg, args) => {
        const { commands } = msg.client;

        let availableCommands = commands.array();

        for (let i = 0; i < availableCommands.length; ++i) {
            const perm = availableCommands[i].permission;
            if (perm && !msg.member.hasPermission(perm)) {
                availableCommands.splice(i, 1);
                i--;
            }
        }
        

        const helpEmbed = new MessageEmbed().setColor(msg.guild.me.displayColor);
        if (!args[0]) {
            helpEmbed.setTitle('Available Commands');
            helpEmbed.setDescription(`*type ${prefix} before a command to run it.*`);
            helpEmbed.setFooter(`Send '${prefix}help |command name|' to get info on a specific command!`);

            let text = ``;
            for (let i = 0; i < availableCommands.length; ++i) {
                const command = availableCommands[i];
                const usage = command.usage || ``;
                
                text += `\n **${command.name}** ${usage}`;
            }
            helpEmbed.addField(`** **`, text);
            await msg.channel.send(helpEmbed);
        } else {
            const command = availableCommands.find(cmd => cmd.name === args[0])
            if (!command) return await msg.reply(`invalid command.`);
            
            const helpEmbed = new MessageEmbed()
                .setColor(msg.guild.me.displayColor)
                .setTitle(prefix + command.name)
                .addField(`${command.name} ${command.usage || ``}`, command.description);
            await msg.channel.send(helpEmbed);
        }
    },
};