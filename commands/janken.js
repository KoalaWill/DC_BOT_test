const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client } = require('discord.js');
const fs = require('node:fs');

//[建立/回覆 button] -> [建立 collector] -> [輸贏啦] -> [讀檔] -> [解析] -> [做事]  -> [回應] -> [存檔]

function range_random(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

module.exports = {
    data: new SlashCommandBuilder().setName('janken').setDescription('Earn money with janken!'),
    async execute(client, interaction) {
    
        //建立 embed 和剪刀石頭布的三個 button
        const buttonEmbed =new EmbedBuilder().setTitle("JANKEN!!!").setColor("Blue").setDescription("yeeet");

        const scissorButton = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("scissorButton").setEmoji("✌️");

        const rockButton =  new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("rockButton").setEmoji("✊");

        const paperButton = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("paperButton").setEmoji("🖐");

        //將三個 button 都放入 row 中並回覆 embed 和 row
        const buttonRow = new ActionRowBuilder().addComponents(scissorButton, rockButton, paperButton);

        //回覆
        interaction.reply({ embeds: [buttonEmbed], components: [buttonRow] });
        

        //建立 collector
        const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });
;

        //等待 collector 蒐集到玩家案的按鈕
        collector.on('collect', async collected => {

            //電腦隨機出拳 (0:剪刀 1:石頭 2:布)
            const botChoice = range_random(0, 2);
            let stringVerChoice = ["剪刀", "石頭", "布"];

            //利用玩家所按按鈕的 customId 來判斷玩家的選擇use
            let playerChoice;
            if(collected.customId == "scissorButton") {
                playerChoice = 0;

            } else if(collected.customId == "rockButton") {
                playerChoice = 1;
            } else if(collected.customId == "paperButton") {
                playerChoice = 2;
            }
            //判斷玩家勝利，電腦勝利或平手 (0:平手 1:電腦 2:玩家)

            let winner = 0;
            if(playerChoice-botChoice == 1 || playerChoice-botChoice == -2){
                winner = 2;
            } else if(playerChoice == botChoice) {
                winner = 0;
            } else winner = 1;
            

            //從結果計算獲得/失去的 money


            let earnings = 0; //賺多少
            let stake = 20;
            if(winner === 1) {
                earnings -= stake;
            } else if(winner === 2) {
                earnings += stake;
            } else{
                //...
            }

            //讀取 players.json 並 parse 成 players
            const data = fs.readFileSync('players.json');
            const players = JSON.parse(data);

            //在所有資料中尋找呼叫此指令玩家的資料
            let found = false;
            for (let i = 0; i < players.length; i++) {

                //如果有就修改該玩家的 money 並回覆結果
                if (players[i].id == interaction.user.id) {
                    found = true;
                    players[i].money += earnings;
                    const resultEmbed = new EmbedBuilder().setTitle(`你出了 ${stringVerChoice[playerChoice]}\n 電腦出了 ${stringVerChoice[botChoice]} `)
                    .setDescription(`結果：${earnings}元\n你現在有 ${players[i].money + earnings} 元!`);
                    interaction.followUp({ embeds: [resultEmbed] });
                    break;
                }
            }

            //如果沒有資料就創建一個新的並回覆結果
            if (found == false) {
                players.push({ id: interaction.user.id, money: 500 - earnings });
                var resultEmbed = new EmbedBuilder().setTitle(`你出了 ${stringVerChoice[playerChoice]}\n 電腦出了 ${stringVerChoice[botChoice]} `)
                    .setDescription(`結果：${earnings}元\n你現在有 ${500 + earnings} 元!`);
                interaction.followUp({ embeds: [resultEmbed] });
            }

            //stringify players 並存回 players.json
            const json = JSON.stringify(players);
            fs.writeFileSync('players.json', json);

            //關閉 collector
            collector.stop();
        });

        
    }
};