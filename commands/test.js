const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const db = require("./../mongoDB");
const { ZifetchInteraction, ZiplayerOption } = require('../events/Zibot/ZiFunc');
const player = useMainPlayer();
const client = require('../bot');

const { Readable } = require('stream');

function isNumber(str) {
  return /^[0-9]+$/.test(str);
}
async function convert_audio(input) {
  try {
    // stereo to mono channel
    const data = new Int16Array(input)
    const ndata = data.filter((el, idx) => idx % 2);
    return Buffer.from(ndata);
  } catch (e) {
    console.log(e)
    console.log('convert_audio: ' + e)
    throw e;
  }
}
module.exports = {
  name: "tests",
  description: "test command.",
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [],
  cooldown: 3,
  dm_permission: true,

  run: async (lang, interaction) => {
    return;
    let message = await ZifetchInteraction(interaction);
    const queues = useQueue(interaction.guild.id);
    const user = await db.ZiUser.findOne({ userID: interaction?.user?.id || interaction?.author?.id }).catch(e => { });
    let queue = player?.nodes?.create(interaction.guild, ZiplayerOption({ interaction, message, queues, user }));
    try {
      if (queue.connection) return interaction.editReply("Err song is playing");
      await queue.connect(
        interaction?.member.voice.channelId,
        { deaf: false })
    } catch (e) {
      return interaction?.channel.send(`${lang?.PlayerSearchErr}`).then(async Message => {
        setTimeout(function () {
          Message?.delete().catch(e => { });
        }, 10000)
      }).catch(e => { console.log(e) });
    }
    const connection = queue.voiceReceiver.dispatcher.voiceConnection.receiver;
    connection.speaking.on('start', async (userId) => {
      const audioStream = queue.voiceReceiver.recordUser(userId, { mode: 'pcm', end: 1 })
      audioStream.on('error', (e) => {
        console.log('audioStream: ' + e)
      });
      let buffer = [];
      audioStream.on('data', (data) => {
        buffer.push(data)
      })
      audioStream.on('end', async () => {
        buffer = Buffer.concat(buffer)
        const duration = buffer.length / 48000 / 4;
        console.log("Time: " + duration)
        if (duration < 1.0 || duration > 19) {
          // console.log("TOO SHORT / TOO LONG; SKPPING")
          return;
        }
        try {
          let new_buffer = await convert_audio(buffer)
          let out = await transcribe(new_buffer);
          const content = out?.text;
          if (content) {
            console.log(content);
            if (content?.includes("play") || content?.includes("phát")) {
              const nameSearch = content?.replace("play", "").replace("phát", "").replace("bài hát", "");
              playmusix({ queue, nameS: nameSearch })
            } else if (content?.includes("bỏ qua bài hát") || content?.includes("skip")) {
              if (queue.repeatMode == 1) queue?.setRepeatMode(QueueRepeatMode.QUEUE)
              queue?.node?.skip()
            } else if (content?.includes("volume") || content.includes("âm lượng")) {
              const vol = content?.match(/\d+/);
              if (!isNumber(vol[0])) return;
              let volume = Math.min(vol[0], 100)
              queue.node.setVolume(Math.abs(volume))
            }
          }
        } catch (e) {
          console.log('tmpraw rename: ' + e)
        }
        audioStream.destroy()
      })
    })
    return;
  },
};
// WitAI
const formatWitaiResponse = (text) => {
  const fixedCommas = text.replace(/\n}\r\n/g, "},");
  const wrappedInArray = `[${fixedCommas}]`;
  return JSON.parse(wrappedInArray);
};

let witAI_lastcallTS = null;
async function transcribe(buffer) {
  try {
    // ensure we do not send more than one request per second
    if (witAI_lastcallTS != null) {
      let now = Math.floor(new Date());
      while (now - witAI_lastcallTS < 1000) {
        console.log('sleep')
        if (now - witAI_lastcallTS > 100) {
          await sleep(now - witAI_lastcallTS - 99);
        } else {
          await sleep(100);
        }
        now = Math.floor(new Date());
      }
    }
  } catch (e) {
    console.log('transcribe_witai 837:' + e)
  }

  try {
    console.log('transcribe_witai')
    var stream = Readable.from(buffer);
    const contentType = "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little";
    const response = await fetch("https://api.wit.ai/speech", {
      method: "post",
      body: stream,
      headers: {
        Authorization: `Bearer ${process.env.WitAI}`,
        "Content-type": contentType,
      },
      duplex: "half"
    });
    if (response.status !== 200)
      throw new Error(`Api error, code: ${response.status}`);

    const data = formatWitaiResponse(await response.text());
    const latestMessage = data.at(-1);
    if (!latestMessage) throw new Error(`Invalid API response`);

    return latestMessage;
    // return output.text
  } catch (e) { console.log('transcribe_witai 851:' + e); console.log(e) }
}
async function playmusix({ queue, nameS }) {
  if (!nameS) return;
  try {
    res = await player.search(await processQuery(nameS), {
      requestedBy: interaction.user,
    });
  } catch {
    return;
  }
  const entry = queue.tasksQueue.acquire();
  await entry.getTask()
  queue.addTrack(res?.tracks[0]);
  try {
    if (!queue.isPlaying()) await queue.node.play()
  } finally {
    queue.tasksQueue.release();
  }
}
