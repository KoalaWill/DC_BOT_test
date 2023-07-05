const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("card_for")
        .setDescription("計算出兩人的牌誰比較大")
        .addNumberOption((option) =>
            option.setName("長_史考特").setDescription("輸入史考特的牌有多長").setRequired(true),
        )
        .addNumberOption((option) =>
            option.setName("寬_史考特").setDescription("輸入史考特的牌有多寬").setRequired(true),
        ),
    async execute(client, interaction) {
        const a = [3, 5, 4, 2, 7]; // 這就是利奧拉手上的牌(長)了，為減少你們一個個輸入數據的時間，已經幫你們把利奧拉的牌準備好了
        const b = [5, 8, 9, 7, 3]; // 這就是利奧拉手上的牌(寬)了，為減少你們一個個輸入數據的時間，已經幫你們把利奧拉的牌準備好了
        let c = interaction.options.getNumber("長_史考特"); // 已經幫你們宣告好變數了，這裡不需要改
        let d = interaction.options.getNumber("寬_史考特"); // 已經幫你們宣告好變數了，這裡不需要改

        let reply = ""; // 可以透過更改這裡的內容來決定回覆的文字
        let area1 = c*d;
        let area2 = 0;
        let min_of_max = Infinity;
        let result = 0;
        let can_win = false;
        for (let i = 0; i < 5; i++) {
            area2 = a[i]*b[i];
            if(area2 > area1) {
                if(area2 < min_of_max) {
                    min_of_max = area2;
                    can_win = true;
                    result = i+1;
                }
            }
            // 還記得昨天新手篇的學習單嗎? 也許你會知道
            // 1. 如何判斷有沒有比史考特大
            // 2. 比史考特大卻又最小的牌
            //這兩個東西要如何判斷
        }
        if(can_win) {
            reply = "利奧拉能贏，會贏的最小牌是第";
            reply += parseInt(result);
            reply += "張，大小是";
            reply += parseInt(a[result-1]*b[result-1]);
        }
        else {
            reply = "贏不了QQ♔♕♖♗♘♙♚♛♜♝♞♟︎";
        }
        await interaction.reply(`${reply}`);
    },
};
