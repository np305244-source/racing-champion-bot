require("dotenv").config();

const express = require("express");
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const app = express();

app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TEAM_ROLES = {
  "Subaru GT3": "1509757555457392933",
  "Toyota GT3": "1509757631781146755",
  "Toyota Supra MK5": "1509757631781146755",
  "Camry GT3": "1509757631781146755",
  "McLaren F1 GTR": "1509757418450587720",
  "Nissan Fairlady Z": "1509757715919015976",
  "Nissan Fairlady Z Nismo": "1509757715919015976",
  "Mazda RX-8": "1509757821774729278",
  "Acura NSX GT3": "1509757892000223394"
};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

app.post("/register", async (req, res) => {

  try {

    const {
      driverName,
      discordId,
      car,
      raceNumber
    } = req.body;

    const guild = await client.guilds.fetch(
      process.env.SERVER_ID
    );

    const member =
      await guild.members.fetch(discordId);

    const roleId = TEAM_ROLES[car];

    if (!roleId) {
      return res.status(400).json({
        error: "Invalid car"
      });
    }

    await member.roles.add(roleId);

    const channel =
      await client.channels.fetch(
        process.env.LOG_CHANNEL_ID
      );

    const embed = new EmbedBuilder()
      .setTitle("🏁 New Registration")
      .setColor("Red")
      .addFields(
        {
          name: "Driver",
          value: driverName,
          inline: true
        },
        {
          name: "Discord ID",
          value: discordId,
          inline: true
        },
        {
          name: "Vehicle",
          value: car,
          inline: false
        },
        {
          name: "Race Number",
          value: raceNumber,
          inline: true
        }
      )
      .setTimestamp();

    await channel.send({
      embeds: [embed]
    });

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

client.login(process.env.BOT_TOKEN);

app.listen(process.env.PORT || 3000, () => {
  console.log("API Running");
});
