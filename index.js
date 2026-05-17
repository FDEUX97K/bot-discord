const {
Client,
GatewayIntentBits,
EmbedBuilder,
SlashCommandBuilder,
REST,
Routes
} = require('discord.js');

require('dotenv').config();

const client = new Client({
intents: [GatewayIntentBits.Guilds]
});

const commands = [
new SlashCommandBuilder()
.setName('action')
.setDescription('Créer une action RP')

.addStringOption(option =>
option.setName('type')
.setDescription('Type d’action')
.setRequired(true)
.addChoices(
{ name: 'ATM', value: 'ATM' },
{ name: 'Supérette', value: 'Supérette' },
{ name: 'Cambu', value: 'Cambu' },
{ name: 'Drogue', value: 'Drogue' },
{ name: 'Go Fast', value: 'Go Fast' },
{ name: 'Labo', value: 'Labo' }
))

.addIntegerOption(option =>
option.setName('montant')
.setDescription('Montant')
.setRequired(true))

.addStringOption(option =>
option.setName('heure')
.setDescription('Heure')
.setRequired(true))

].map(command => command.toJSON());

client.once('clientReady', async () => {

console.log(`✅ Connecté : ${client.user.tag}`);

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {

const guilds = await client.guilds.fetch();
const firstGuild = guilds.first();

await rest.put(
Routes.applicationGuildCommands(
client.user.id,
firstGuild.id
),
{ body: commands }
);

console.log('✅ Commande /action installée');

} catch (error) {
console.log(error);
}

});

client.on('interactionCreate', async interaction => {

if (!interaction.isChatInputCommand()) return;

if (interaction.commandName === 'action') {

try {

const type = interaction.options.getString('type');
const montant = interaction.options.getInteger('montant');
const heure = interaction.options.getString('heure');

const embed = new EmbedBuilder()
.setTitle('📌 Nouvelle Action RP')
.setColor('Red')
.addFields(
{
name: '👤 Membre',
value: `${interaction.user}`,
inline: true
},
{
name: '🎯 Action',
value: type,
inline: true
},
{
name: '💰 Montant',
value: `${montant}$`,
inline: true
},
{
name: '🕒 Heure',
value: heure,
inline: true
}
)
.setTimestamp();

await interaction.reply({
embeds: [embed],
ephemeral: false
});

} catch (error) {

console.log(error);

await interaction.reply({
content: '❌ Erreur.',
ephemeral: true
});

}

}

});

client.login(process.env.TOKEN);