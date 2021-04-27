const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
//const logsFile = fs.readFileSync('logs.json');
//console.log(logsFile);
client.logs = new Discord.Collection();
//client.logs = logsFile;
client.cooldowns = new Discord.Collection();


//find all commands
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.once("ready", () => {
    console.log("Running!");
    setPresence();
});

client.on("message", msg => {
    //Bugprint is life
    if (msg.content.toLowerCase().includes("bugprint")) {
        msg.react("803001352774352896");
        //msg.react("834798755513499699");
        addBugprint();
    }



    if (!msg.content.startsWith(prefix)) return;

    let args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    //put end arguments together
    if (command.argsEnd && args.length > command.argsEnd + 1) {
        let newArgs = [];
        for (let i = 0; i < command.argsEnd; ++i){
            newArgs.push(args.shift());
        }
        newArgs.push(args.join(` `));
        args = newArgs;
    }
    
    //check for permission
    if (command.permission && !msg.member.hasPermission(command.permission)) {
        return msg.reply("you don't have permission to use that command.");
    }

    //check for channel
    if (command.channels && !command.channels.some(c => c === msg.channel.name)) return;

    //check for guild
    if (command.guild && msg.guild.name != command.guild) return;

    const cooldown = checkForCooldown(command.cooldown || 2, command.name, msg)
    if (cooldown) return msg.reply(cooldown);
    
        
    try {
	    command.execute(msg, args);
    } catch (error) {
	    console.error(error);
	    msg.reply("Error: " + error);
    }
    
});

client.login(token);

/**
 * 
 * @param {Discord.Message} msg 
 */
function addBugprint() {
    fs.writeFileSync("bugprints.txt",  (parseInt(fs.readFileSync(`bugprints.txt`)) + 1).toString());
    setPresence();
}

function setPresence() {
    const bugprints = parseInt(fs.readFileSync(`bugprints.txt`));
    const description = bugprints == 1 ? `bugprint` : `bugprints`;
    client.user.setPresence({
        activity: {
            name: `${bugprints} ${description}`,
            type: 'WATCHING',
        }
    });
}

/**
 * 
 * @param {number} cooldown 
 * @param {string} name 
 * @param {Discord.Message} msg 
 * @returns 
 */
function checkForCooldown(cooldown, name, msg) {
    const { cooldowns } = client;

    if (!cooldowns.has(name)) {
    	cooldowns.set(name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(name);
    const cooldownAmount = cooldown * 1000;

    if (timestamps.has(msg.member.id)) {
    	const expirationTime = timestamps.get(msg.member.id) + cooldownAmount;

	    if (now < expirationTime) {
	    	const timeLeft = (expirationTime - now) / 1000;
            return `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${name}\` command.`;
        }
    }
    timestamps.set(msg.member.id, now);
    setTimeout(() => timestamps.delete(msg.member.id), cooldownAmount);
    return null;
}