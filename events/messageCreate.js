const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { rank } = require("./Zibot/ZilvlSys");
const config = require("../config");
const ziSearch = require("./ziplayer/ziSearch");
const { animatedIcons } = require("./Zibot/ZiFunc");

const playMusic = async ({lang, message, client, content}) => {
    const member = message.member;
    if (!member.voice.channelId) {
        return message.reply({ content: lang?.NOvoice, ephemeral: true }).catch(() => {});
    }

    const botMember = message.guild.members.cache.get(client.user.id);
    if (botMember.voice.channelId && botMember.voice.channelId !== member.voice.channelId) {
        return message.reply({ content: lang?.NOvoiceChannel, ephemeral: true }).catch(() => {});
    }

    return ziSearch(message, content);
};

const fetchMessageContent = async ({message, refMsgId, lang}) => {
    const mess = await message.channel.messages.fetch(refMsgId, { cache: false, force: true });
    let name = mess.content;
    if (!name) {
        const embedData = mess?.embeds[0]?.data;
        if(embedData){
          const firstFieldName = embedData?.fields?.[0]?.name;
          const hasSpecialField = firstFieldName?.includes("▒") || firstFieldName?.includes("█");
          name = hasSpecialField ? embedData.author?.url :  embedData.description;
        }
      }
    if (name) return name;
    message.reply({embeds:[
        new EmbedBuilder()
            .setColor("Red")
            .setImage("https://cdn.discordapp.com/attachments/1064851388221358153/1255682265837473822/context_menus_playing_music.gif")
            .setDescription("❌ | **Tính năng này đã không còn hoạt động hãy sử dụng context menu thay thế**")
            .setFooter({ text: `${lang?.RequestBY} ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
    ]})
    return null;
};

const handleBotMention = async (message, client, lang) => {
    const embed = new EmbedBuilder()
        .setColor(lang?.COLOR || client.color)
        .setTitle("Yo... Ziji desu :3")
        .setDescription(`${lang?.MENstion} <a:_:${animatedIcons[Math.floor(Math.random() * animatedIcons.length)]}> \n${config?.Zmodule} ✅`)
        .setURL(`${client?.InviteBot}`)
        .setTimestamp()
        .setFooter({ text: `${lang?.RequestBY} ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setImage(lang?.banner);
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("buttHelp")
            .setLabel("/HELP")
            .setStyle(ButtonStyle.Secondary)
    )
    return message.reply({ embeds: [embed], components: [row] });
};

module.exports = async (client, message) => {
    if (message.author.bot || message.content.includes("@here") || message.content.includes("@everyone")) return;

    const botMentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (!message.content.includes(`<@${client.user.id}>`) && !message.content.match(botMentionRegex)) return;

    const content = message.content.toLowerCase();
    const lang = await rank({ user: message.author });

    message.react("<a:likee:1210193685501706260>");

    if (message.reference && message.guild) {
        const refMsgId = message.reference.messageId;
        const msgContent = await fetchMessageContent({message, refMsgId, lang});
        if (msgContent) {
            return playMusic({lang, message, client, content: msgContent});
        }
    }

    if (botMentionRegex.test(content) && !message.reference) {
        return handleBotMention(message, client, lang);
    }

    if (message.guild) {
        const playContent = message.content.replace(`<@${client.user.id}>`, "").trim();
        if(playContent) return playMusic({lang, message, client, content: playContent});
    }
};
