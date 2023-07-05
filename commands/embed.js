const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder().setName("embed").setDescription("show an embed"),
    async execute(client, interaction) {
        const embed = new EmbedBuilder()
        .setTitle("My page")
        .setColor('Orange')
        // .setAuthor({ name: '', iconURL: '放URL', url: '放URL' })
        .setDescription('urhhhh...')
        .setURL('https://koalawill.github.io')
        .setThumbnail('https://www.youtube.com/watch?v=g08gsd7d87Y&pp=ygUVbWFjIG1pbGxlciBvbmNlIGEgZGF5')
        .addFields({ name: 'field 1', value: '?', inline: true })
        .setImage('https://media2.giphy.com/media/IWy60FY7KKOOc/200.webp?cid=ecf05e47bvarz9a9jn075rbzvhotkhx4bq6wfx3gr9waqu9o&ep=v1_gifs_search&rid=200.webp&ct=g')
        .setTimestamp()
        // .setFooter({ text: '', iconURL: '放URL' });
        interaction.reply({ embeds: [embed] });
    },
};


