const fs = require('fs');
const Discord = require('discord.js');

const config = require('./config.json');

const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    setTimeout(() => {  console.log('Loading Commands...'); }, 1);
    setTimeout(() => {  console.log("Starting Up..."); }, 2000);
    setTimeout(() => {  console.log('Bot is online!'); }, 4000);
	setTimeout(() => {  console.log('Made By: ItzYaBoiAndrew#4651'); }, 6000);
	client.user.setActivity(config.status, { type: config.statustype });
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    
    const command = client.commands.get(commandName);

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	if (timestamps.has(message.author.id)) {
		// ...
	}

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command.');
	}
});


client.login(config.token);