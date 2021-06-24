const { Message, MessageEmbed } = require(`discord.js`);


/** @type {string[]} */
const emojis = [
    `🇦`, `🇧`, `🇨`, `🇩`, `🇪`, `🇫`, `🇬`, `🇭`, `🇮`, `🇯`
];


module.exports = {
    name: `poll`,
    usage: `[Title] [Option 1] [Option 2] ...`,
    description: `Creates a reaction poll between up to 10 different options.`,

    permission: `MENTION_EVERYONE`,
    channels: [`polls`, `bot-testing`, `💬surveys`, `beta-surveys`],

    argWrap: [`[`, `]`],
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async (msg, args) => {
        if (args.length < 3) return await msg.reply(
            `you have to have at least two options for a poll.`
        )
        args.length = Math.min(11, args.length);

        const pollEmbed = new MessageEmbed().setColor(msg.guild.me.displayColor).setTitle(args.shift());

        let options = ``;
        let reactions = [];
        for (let i = 0; i < args.length; ++i) {
            const emoji = emojis[i];
            reactions.push(emoji);
            options += emoji + `  ` + args[i] + `\n\n`;
        }

        pollEmbed.addField('** **', options);

        const message = await msg.channel.send(pollEmbed);
        await msg.delete();

        for (let i = 0; i < reactions.length; ++i) {
            await message.react(reactions[i]);
        }
	},
};