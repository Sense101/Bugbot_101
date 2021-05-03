const { Message } = require(`discord.js`);

module.exports = {
    name: `addmod`,
    usage: `|mod name|`,
    description: `Adds a new mod discussion channel plus a new role for that mod.`,

    guild: `shapez.io Modding Server`,
    permission: `ADMINISTRATOR`,

    argsEnd: 0,

    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async (/** @type {Message}*/ msg, args) => {
        if (!args[0]) return await msg.reply(
            `please provide a name for the new mod.`
        );
        
        const roleName = args[0].replace(/` `/g, ``);
        
        const newRole = await msg.guild.roles.create({
            data: {
                name: roleName,
                color: `#000000`,
            }
        });
        
        const channelName = args[0].toLowerCase().replace(/` `/g, `-`);

        const newChannel = await msg.guild.channels.create(channelName, {
            type: "text",
            parent: `778032492174245958`,
            permissionOverwrites: [
                {
                    id: msg.guild.roles.everyone.id,
                    deny: [`VIEW_CHANNEL`],
                },
                {
                    id: newRole.id,
                    allow: [`VIEW_CHANNEL`],
                },
                {
                    id: `777350598621921280`,
                    allow: [`VIEW_CHANNEL`],
                },
            ],
        });
        await newChannel.send(`Welcome to the new ${args[0]} mod discussion channel!`);
        
        await msg.reply(`successfully added a new mod called ${args[0]}.`);
	},
};