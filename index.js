const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');


/**
 * @typedef {Object} Log
 * @property {string} memberId
 * @property {string} reason
 * }
 */

/**
 * @typedef {Object} LogGroup
 * @property {string} id
 * @property {Log[]} logs
 * }
 */



const client = new Discord.Client();
client.commands = new Discord.Collection();

const logs = JSON.parse(fs.readFileSync(`logs.json`));
/** @type {LogGroup[]} */
client.logs = logs || [
    { id: `mutes`, logs: [] },
    { id: `warns`, logs: [] },
    { id: `kicks`, logs: [] },
    { id: `bans`, logs: [] },
];

let bugprints = parseInt(fs.readFileSync(`bugprints.txt`)) || 0;

function loadCommands() {
    //find all commands
    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
    	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    	for (const file of commandFiles) {
    		const command = require(`./commands/${folder}/${file}`);
    		client.commands.set(command.name, command);
    	}
    }
}


client.once("ready", async () => {
    loadCommands();
    await setPresence();
    console.log("Running!");
});

client.on("message", async msg => {

    if (!msg.content.startsWith(prefix)) return;
    
    let args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    //redo args
    if (command.argWrap) {
        const fullArgs = msg.content.slice(prefix.length + command.name.length).trim();
        const startIndex = fullArgs.indexOf(command.argWrap[0]);
        const endIndex = fullArgs.lastIndexOf(command.argWrap[1]);

        args = fullArgs.slice(startIndex + command.argWrap[0].length, endIndex)
            .split(new RegExp(`\\${command.argWrap[1]} +\\${command.argWrap[0]}`));
    }

    //change arguments based on command
    if (command.argsEnd) {
        if (command.argsEnd <= 0) {
            args.length = 1;
            args[0] = msg.content.slice(prefix.length + command.name.length).trim();
        } else if (args.length > command.argsEnd + 1) {
            let newArgs = [];
            for (let i = 0; i < command.argsEnd; ++i){
                newArgs.push(args.shift());
            }
            newArgs.push(args.join(` `));
            args = newArgs;
        }
    }
    
    //check for permission
    if(command.permission && !msg.member.hasPermission(command.permission)) {
        return msg.reply("you don't have permission to use that command.");
    }

    //check for channel
    if (command.channels && !command.channels.some(c => c === msg.channel.name)) return;

    //check for guild
    if (command.guild && msg.guild.name != command.guild) return;
    
        
    try {
	    await command.execute(msg, args);
    } catch (error) {
	    console.error(error);
	    await msg.reply("Error: " + error);
    }
    
});

client.on(`message`, async msg => {
    //Bugprint is life
    if (msg.content.toLowerCase().includes("bugprint")) {
        try {
            await msg.react("803001352774352896");
        } catch {
            console.log(`Failed to add bugprint reaction to message!`);
        }
        bugprints++;
        fs.writeFileSync("bugprints.txt",  bugprints.toString());
        await setPresence();
    }
})

client.login(token);

async function setPresence() {
    const description = bugprints == 1 ? `bugprint` : `bugprints`;
    await client.user.setPresence({
        activity: {
            name: `${bugprints} ${description}`,
            type: 'WATCHING',
        }
    });
}