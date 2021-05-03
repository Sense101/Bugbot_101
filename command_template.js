const { Message } = require(`discord.js`);

module.exports = {
    name: `template`,
    usage: `|template|`,
    description: `Adds a new mod discussion channel which is limited to the roles`,

    permission: ``,
    channels: [``],
    guild: ``,

    argsEnd: 0,
    argSplit: / +/,
    
    /**
     * @param {Message} msg 
     * @param {string[]} args 
     */
    execute: async (msg, args) => {
        
	},
};