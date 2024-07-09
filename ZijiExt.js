"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
    for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
    ZijiExt: () => ZijiExt,
});
module.exports = __toCommonJS(lib_exports);

var import_discord_player = require("discord-player");
var import_extractor = require("@discord-player/extractor");
var import_youtube_sr = require("youtube-sr");
var import_youtube_sr2 = require("youtube-sr");
// @retrouser955   discord-player-youtubei
var DEFAULT_DOWNLOAD_OPTIONS = {
    quality: "best",
    format: "mp4",
    type: "audio"
};
async function streamFromYT(query, innerTube2, options = { overrideDownloadOptions: DEFAULT_DOWNLOAD_OPTIONS }) {
    const ytId = query.includes("shorts") ? query.split("/").at(-1).split("?")[0] : new URL(query).searchParams.get("v");
    const streamData = await innerTube2.getStreamingData(ytId, options.overrideDownloadOptions);
    const decipheredStream = streamData.decipher(innerTube2.session.player);
    if (!decipheredStream) throw new Error("Unable to get stream data from video.");
    return decipheredStream;
}
async function makeYTSearch(query, opt) {
    const res = await import_youtube_sr2.YouTube.search(query, {
        type: "video",
        safeSearch: opt?.safeSearch,
        requestOptions: opt
    }).catch(() => {
    });
    return res || [];
}

// lib/common/createInnertubeClient.ts
var import_youtubei = __toESM(require("youtubei.js"));
var innerTube;
async function createInnertubeClient() {
    if (innerTube) return innerTube;
    innerTube = await import_youtubei.default.create({
        cache: new import_youtubei.UniversalCache(true, `${process.cwd()}/.dpy`)
    });
    return innerTube;
}
// lib/Extractor/Youtube.ts
var ZijiExt = class _ZijiExt extends import_discord_player.BaseExtractor {
    static identifier = "com.ziji.discord-player.ZijiExt";
    innerTube;
    _stream;
    static instance;
    async activate() {
        this.protocols = ["ytsearch", "youtube"];
        this.innerTube = await createInnertubeClient();
        if (typeof this.options.createStream === "function") {
            this._stream = this.options.createStream;
        } else {
            this._stream = (q, _) => {
                return streamFromYT(q, this.innerTube, {
                    overrideDownloadOptions: this.options.overrideDownloadOptions
                });
            };
        }
        _ZijiExt.instance = this;
    }
    async deactivate() {
        this.protocols = [];
        _ZijiExt.instance = null;

    }

    async validate(query, type) {
        if (typeof query !== "string") return false;
        return [
            import_discord_player.QueryType.YOUTUBE,
            import_discord_player.QueryType.YOUTUBE_PLAYLIST,
            import_discord_player.QueryType.YOUTUBE_SEARCH,
            import_discord_player.QueryType.YOUTUBE_VIDEO,
            import_discord_player.QueryType.AUTO,
            import_discord_player.QueryType.AUTO_SEARCH
        ].some((r) => r === type);
    }
    async handle(query, context) {
        if (context.protocol === "ytsearch")
            context.type = import_discord_player.QueryType.YOUTUBE_SEARCH;
        query = query.includes("youtube.com") ? query.replace(/(m(usic)?|gaming)\./, "") : query;
        if (!query.includes("list=RD") && import_extractor.YouTubeExtractor.validateURL(query))
            context.type = import_discord_player.QueryType.YOUTUBE_VIDEO;
        switch (context.type) {
            case import_discord_player.QueryType.YOUTUBE_PLAYLIST: {
                const ytpl = await import_youtube_sr.YouTube.getPlaylist(query, {
                    fetchAll: true,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    limit: context.requestOptions?.limit,
                    requestOptions: context.requestOptions
                }).catch(import_discord_player.Util.noop);
                if (!ytpl)
                    return this.emptyResponse();
                const playlist = new import_discord_player.Playlist(this.context.player, {
                    title: ytpl.title,
                    thumbnail: ytpl.thumbnail?.displayThumbnailURL("maxresdefault"),
                    description: ytpl.title || "",
                    type: "playlist",
                    source: "youtube",
                    author: {
                        name: ytpl.channel.name,
                        url: ytpl.channel.url
                    },
                    tracks: [],
                    id: ytpl.id,
                    url: ytpl.url,
                    rawPlaylist: ytpl
                });
                playlist.tracks = ytpl.videos.map((video) => {
                    const track = new import_discord_player.Track(this.context.player, {
                        title: video.title,
                        description: video.description,
                        author: video.channel?.name,
                        url: video.url,
                        requestedBy: context.requestedBy,
                        thumbnail: video.thumbnail.url,
                        views: video.views,
                        duration: video.durationFormatted,
                        raw: video,
                        playlist,
                        source: "youtube",
                        queryType: "youtubeVideo",
                        metadata: video,
                        async requestMetadata() {
                            return video;
                        }
                    });
                    track.extractor = this;
                    track.playlist = playlist;
                    return track;
                });
                return { playlist, tracks: playlist.tracks };
            }
            case import_discord_player.QueryType.YOUTUBE_VIDEO: {
                const id = /[a-zA-Z0-9-_]{11}/.exec(query);
                if (!id?.[0])
                    return this.emptyResponse();
                const video = await import_youtube_sr.YouTube.getVideo(`https://www.youtube.com/watch?v=${id}`, context.requestOptions).catch(import_discord_player.Util.noop);
                if (!video)
                    return this.emptyResponse();
                video.source = "youtube";
                const track = new import_discord_player.Track(this.context.player, {
                    title: video.title,
                    description: video.description,
                    author: video.channel?.name,
                    url: video.url,
                    requestedBy: context.requestedBy,
                    thumbnail: video.thumbnail?.displayThumbnailURL("maxresdefault"),
                    views: video.views,
                    duration: video.durationFormatted,
                    source: "youtube",
                    raw: video,
                    queryType: context.type,
                    metadata: video,
                    async requestMetadata() {
                        return video;
                    }
                });
                track.extractor = this;
                return {
                    playlist: null,
                    tracks: [track]
                };
            }
            default: {
                const tracks = await this._makeYTSearch(query, context);
                return { playlist: null, tracks };
            }
        }
    }
    async _makeYTSearch(query, context) {
        const res = await makeYTSearch(query, context.requestOptions).catch(import_discord_player.Util.noop);
        if (!res || !res.length)
            return [];
        return res.map((video) => {
            video.source = "youtube";
            const track = new import_discord_player.Track(this.context.player, {
                title: video.title,
                description: video.description,
                author: video.channel?.name,
                url: video.url,
                requestedBy: context.requestedBy,
                thumbnail: video.thumbnail?.displayThumbnailURL("maxresdefault"),
                views: video.views,
                duration: video.durationFormatted,
                source: "youtube",
                raw: video,
                queryType: context.type,
                metadata: video,
                async requestMetadata() {
                    return video;
                }
            });
            track.extractor = this;
            return track;
        });
    }
    async getRelatedTracks(track, history) {
        let info = void 0;
        if (_YoutubeExtractor.validateURL(track.url))
            info = await import_youtube_sr.YouTube.getVideo(track.url).then((x) => x.videos).catch(import_discord_player.Util.noop);
        if (!info)
            info = await import_youtube_sr.YouTube.search(track.author || track.title, { limit: 5, type: "video" }).then((x) => x).catch(import_discord_player.Util.noop);
        if (!info?.length) {
            return this.createResponse();
        }
        const unique = info.filter((t) => !history.tracks.some((x) => x.url === t.url));
        const similar = (unique.length > 0 ? unique : info).map((video) => {
            const t = new import_discord_player.Track(this.context.player, {
                title: video.title,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                duration: video.durationFormatted || import_discord_player.Util.buildTimeCode(import_discord_player.Util.parseMS(video.duration * 1e3)),
                description: video.title,
                thumbnail: typeof video.thumbnail === "string" ? video.thumbnail : video.thumbnail.url,
                views: video.views,
                author: video.channel.name,
                requestedBy: track.requestedBy,
                source: "youtube",
                queryType: "youtubeVideo",
                metadata: video,
                async requestMetadata() {
                    return video;
                }
            });
            t.extractor = this;
            return t;
        });
        return this.createResponse(null, similar);
    }
    emptyResponse() {
        return { playlist: null, tracks: [] };
    }
    stream(info) {
        return this._stream(info.url, this);
    }
    async getRelatedTracks(track, history) {
        if (!import_extractor.YoutubeExtractor.validateURL(track.url)) return this.#emptyResponse();
        const video = await track.requestMetadata();
        if (!video) {
            this.context.player.debug("UNEXPECTED! VIDEO METADATA WAS NOT FOUND. HAVE YOU BEEN TEMPERING?");
            return {
                playlist: null,
                tracks: []
            };
        }
        const isVidInfo = typeof video?.getWatchNextContinuation === "function";
        const rawVideo = isVidInfo ? video : await this.innerTube.getInfo(video.id);
        if (rawVideo.watch_next_feed) {
            this.context.player.debug("Unable to get next video. Falling back to `watch_next_feed`");
            const recommended = rawVideo.watch_next_feed.filter(
                (v) => !history.tracks.some((x) => x.url === `https://youtube.com/watch?v=${v.id}`) && v.type === "CompactVideo"
            );
            if (!recommended) {
                this.context.player.debug("Unable to fetch recommendations");
                return this.#emptyResponse();
            }
            const trackConstruct = recommended.map((v) => {
                return new import_discord_player.Track(this.context.player, {
                    title: v.title?.text ?? "UNKNOWN TITLE",
                    thumbnail: v.best_thumbnail?.url ?? v.thumbnails[0]?.url,
                    author: v.author?.name ?? "UNKNOWN AUTHOR",
                    requestedBy: track.requestedBy,
                    url: `https://youtube.com/watch?v=${v.id}`,
                    views: parseInt(v.view_count?.text ?? "0"),
                    duration: v.duration?.text,
                    raw: v,
                    source: "youtube",
                    queryType: "youtubeVideo",
                    metadata: v,
                    async requestMetadata() {
                        return v;
                    }
                });
            });
            return {
                playlist: null,
                tracks: trackConstruct
            };
        }
        this.context.player.debug("Unable to fetch recommendations");
        return this.#emptyResponse();
    }
    #emptyResponse() {
        return {
            playlist: null,
            tracks: []
        };
    }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    ZijiExt,
});
