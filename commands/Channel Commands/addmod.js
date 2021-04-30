const { Message } = require(`discord.js`);

module.exports = {
    name: `addmod`,
    usage: `{role name}`,
    description: `Adds a new mod discussion channel which is limited to the roles`,
    noArgs: true,

    guild: `shapez.io Modding Server`,
    permission: `ADMINISTRATOR`,

    
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
                mentionable: true,
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