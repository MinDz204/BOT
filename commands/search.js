module.exports = {
    name: "search",
    description: "Search a query on Google.",
    options: [{
        name: "content",
        description: "content description...",
        type: 3,
        required: true,
      }],
    cooldown: 3,
    NODMPer: false,
  };
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../bot');
const db = require("../mongoDB");
const { shuffleArray } = require('../events/Zibot/ZiFunc');

module.exports.run = async ( lang, interaction, searcher, button ) => {
const name = interaction?.options?.getString("content") || searcher;
let messid,message;
if(!button){
messid = await interaction?.reply({ content: `<a:loading:1151184304676819085> Loading...`, fetchReply: true})
}else(
messid = await interaction?.edit({ content: `<a:loading:1151184304676819085> Loading...`, fetchReply: true, components: [  ]})
)
const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId(`ZsearchrefZi=${name}`)
        .setLabel('↻')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("❌")
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId("cancelXcancel")
        .setLabel("←❌")
        .setStyle(ButtonStyle.Secondary)
)
const paginatedMessage = await generatePaginatedMessage( name, !interaction?.channel?.nsfw || false, lang );
if(interaction?.commandName || interaction?.commandType || interaction?.commandId || !!interaction?.interaction){
    message = await interaction.fetchReply().catch(e=>{ });
}else{
    message =  await interaction.channel?.messages.fetch({ message: messid , cache: false, force: true })
}
if (!paginatedMessage?.embed[0] && !paginatedMessage?.attachment[0] ) {
    const IMGp = await generateIMGMessage( name, !interaction?.channel?.nsfw || false, lang );
    if(IMGp) return message.edit({ content: ``, files:IMGp,components: [ row ]})
    return message.edit({
        content: `No results found for the message ${name}.`,
        ephemeral: true,
        components: [ row ]
    });
}

return message.edit({ content: ``, components: [ row ], embeds: paginatedMessage.embed.slice(0,5) ,files: paginatedMessage.attachment.slice(0,5) })
}

const generatePaginatedMessage = async(query, nsfw, lang ) => {
    // Avoid type error
    const googleThisApi = require("googlethis")
    const search = await googleThisApi.search(query, { page: 0, safe: nsfw, additional_params: { hl: 'en' } });
    const paginatedMessage =[ ],    attachment = [ ];

    // Generate Knowledge Panel first
    const knowledgePanelEmbed = await generateKnowledgePanelEmbed(search.knowledge_panel,lang);
    if (knowledgePanelEmbed) {
        paginatedMessage.push(knowledgePanelEmbed);
    }

    if ('dictionary' in search) {
        const dictionaryEmbed = await generateDictionaryEmbed(search.dictionary,lang);
        if (dictionaryEmbed) {
            paginatedMessage.push(dictionaryEmbed?.embed);
            attachment.push(dictionaryEmbed?.attachment);
        }
    }

    if ('translation' in search) {
        const translationEmbed = await generateTranslationEmbed(search.translation,lang);
        if (translationEmbed) {
            paginatedMessage.push(translationEmbed);
        }
    }

    if ('unit_converter' in search) {
        const unitConverterEmbed = await generateUnitConverterEmbed(search.unit_converter,lang);
        if (unitConverterEmbed) {
            paginatedMessage.push(unitConverterEmbed);
        }
    }

    const resultsEmbeds = generateResultsEmbeds(search.results,lang);
    const chunkSize = 5;
    for (let i = 0; i < resultsEmbeds.length; i += chunkSize) {
        paginatedMessage.push(resultsEmbeds.slice(i, i + chunkSize));
    }

    return { embed:paginatedMessage, attachment};
}
//::::::::::::IMG:::::::::::::://
const generateIMGMessage = async(query, nsfw, lang ) => {
    // Avoid type error
    const googleThisApi = require("googlethis")
    const searchz = await googleThisApi.image(query, { safe: nsfw });
    const attachment = [ ];
    const search = shuffleArray(searchz)

    for (let k = 1; k < 10; k++) {
        const data = search[k];
        if (
            !!data?.url
        ) {
        let imgar;
        if (data.url.includes("gif")){ imgar = ".gif"} else { imgar = ".jpg"}
        let img = await new AttachmentBuilder(data.url, { name: `${data?.id}${imgar}`, description: `${data?.origin?.title}` })
        attachment.push(img)
        }
    }
    return attachment;
}
//:::::::::::::::::::::::::://
const generateKnowledgePanelEmbed = async(knowledgePanelData,lang) => {

    if (knowledgePanelData?.title == null || knowledgePanelData?.title === 'N/A'
    ) {
        return false;
    }

    const embed = new EmbedBuilder()
        .setColor( lang?.COLOR || client.color)
        .setAuthor({
            name: knowledgePanelData.title,
            url: !knowledgePanelData?.url ? undefined : knowledgePanelData.url
        });

    let description = '';
    if ('type' in knowledgePanelData && knowledgePanelData?.type && knowledgePanelData?.type !== 'N/A') {
        description += `*${knowledgePanelData.type}*\n\n`;
    }
    if (knowledgePanelData?.description || knowledgePanelData?.description !== 'N/A') {
        description += knowledgePanelData.description;
    }
    if (knowledgePanelData?.lyrics || knowledgePanelData?.lyrics !== 'N/A') {
        description += knowledgePanelData.lyrics;
    }
    if (description.length > 0) {
        embed.setDescription(description.length > 1997 ? `${description.substring(0, 1997)}...` : description);
    }

    if (knowledgePanelData?.url && knowledgePanelData.url !== 'N/A') {
        const { getLinkPreview } = require("link-preview-js")
        const linkPreview = await getLinkPreview(knowledgePanelData.url);
        if ('images' in linkPreview && linkPreview?.images) {
            embed.setImage(linkPreview.images[0]);
        }
        if ('favicons' in linkPreview && linkPreview?.favicons) {
            for (let favicon of linkPreview.favicons) {
                if (favicon.endsWith('.jpg') || favicon.endsWith('.png')) {
                    embed.setThumbnail(favicon);
                    break;
                }
            }
        }
    }

    for (let k in knowledgePanelData) {
        const data = knowledgePanelData[k];
        if (
            k === 'title'
            || k === 'description'
            || k === 'url'
            || data?.constructor?.name == 'Array'
            || k === 'lyrics'
            || k === 'type'
        ) {
            continue;
        }
        k = k.replace('_', ' ');
        k = k.charAt(0).toUpperCase() + k.slice(1);
        if(k && data){
        embed.addFields([
            { name: k, value: data, inline: true },
        ])
    }

    }

    return embed;
}

const generateDictionaryEmbed = async(dictionaryData,lang) => {
    if (
        (dictionaryData.word == null || dictionaryData.word === 'N/A')
        && dictionaryData.definitions.length <= 0
    ) {
        return false;
    }
    const attachment = new AttachmentBuilder(dictionaryData.audio, { name: `${dictionaryData.word}.mp3` });
    const embed = new EmbedBuilder()
        .setColor( lang?.COLOR || client.color)
        .setAuthor({
            name: dictionaryData.word,
            url: dictionaryData.audio,
            iconURL: 'https://i.imgur.com/lbK1BPV.png'
        });
    if (dictionaryData.phonetic.length > 0 && dictionaryData.phonetic !== 'N/A') {
        embed.setDescription(`*${dictionaryData.phonetic}*`);
    }

    const definitionArray = []
    let i = 1;
    for (let definition of dictionaryData.definitions) {
        let str = `**${i}.** ${definition}`;
        if (dictionaryData.examples[i - 1] !== undefined) {
            str += `\n*ex: ${dictionaryData.examples[i - 1]}*`;
        }
        definitionArray.push(str);
        i++;
    }
    embed.addFields([
        { name: 'Definition(s)', value: `${definitionArray.join('\n')}`, inline: true },
    ])

    return { embed, attachment};
}

const generateTranslationEmbed = async(translationData,lang) => {
    if (
        (translationData.source_text == null || translationData.source_text === 'N/A')
        && (translationData.target_text == null || translationData.target_text === 'N/A')
    ) {
        return false;
    }

    const embed = new EmbedBuilder()
        .setColor( lang?.COLOR || client.color)
        .setAuthor({
            name: 'Translate',
            iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/512px-Google_Translate_logo.svg.png'
        })
        .addFields([
            { name: `${translationData.source_language}`, value: `${translationData.source_text}`, inline: true },
            { name: `${translationData.target_language}`, value: `${translationData.target_text}`, inline: true },
        ])

    return embed;
}
const generateUnitConverterEmbed = async(unitConverterData,lang) => {
    if (
        (unitConverterData.input == null || unitConverterData.input === 'N/A')
        && (unitConverterData.output == null || unitConverterData.output === 'N/A')
    ) {
        return false;
    }

    const embed = new EmbedBuilder()
        .setColor( lang?.COLOR || client.color)
        .setAuthor({
            name: `Unit Converter`,
            iconURL: 'https://i.imgur.com/D5XSxB8.png'
        })
        .addFields([
            { name: 'Input', value: `\`${unitConverterData.input}\``, inline: true },
            { name: 'Output', value: `\`${unitConverterData.output}\``, inline: true },
        ]);


    if ('formula' in unitConverterData && unitConverterData.formula.length > 0 && unitConverterData.formula !== 'N/A') {
        embed.setDescription(`*${unitConverterData.formula.charAt(0).toUpperCase() + unitConverterData.formula.slice(1)}*`)
    }

    return embed;
}

const generateResultsEmbeds = (results,lang)=> {
    if (results.length <= 0) return [];

    const msgEmbeds = [];
    for (let result of results) {
        const embed = new EmbedBuilder()
            .setColor( lang?.COLOR || client.color)
            .setAuthor({
                name: result.title,
                url: result.url
            });

        if (result.description.length > 0 && result.description !== 'N/A') {
            embed.setDescription(result.description);
        }

        const favIcon = result.favicons.high_res ?? result.favicons.low_res;
        if (favIcon) {
            embed.setThumbnail(favIcon);
        }

        msgEmbeds.push(embed);
    }

    return msgEmbeds;
}