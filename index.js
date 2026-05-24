```js
const express = require("express");
const app = express();
const fs = require('fs');

const moneyFile = 'money.json';

if (!fs.existsSync(moneyFile)) {
fs.writeFileSync(moneyFile, JSON.stringify({ total: 0 }));
}

app.get("/", (req, res) => {
  res.send("Bot online !");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server lancé");
});

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
.setRequired(true)),

new SlashCommandBuilder()
.setName('total')
.setDescription('Voir l’argent total')

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

console.log('✅ Commandes installées');

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

const data = JSON.parse(fs.readFileSync(moneyFile));

data.total += montant;

fs.writeFileSync(moneyFile, JSON.stringify(data, null, 2));

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
},
{
name: '🏦 Total Serveur',
value: `${data.total}$`,
inline: false
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

if (interaction.commandName === 'total') {

const data = JSON.parse(fs.readFileSync(moneyFile));

await interaction.reply({
content: `💰 Caisse totale du serveur : ${data.total}$`
});

}

});

client.login(process.env.TOKEN);
```

Ensuite dans PowerShell :

```bash
cd Desktop\bot-discord
```

Puis :

```bash
git add .
```

Puis :

```bash
git commit -m "add total system"
```

Puis :

```bash
git push
```

🚀
