import { renderSidebarPlaylists } from "./app.js";
import { renderSongList } from "./songlist.js";
import { renderPlayer } from "./player.js";

const insertHTML = (el, html) => el.insertAdjacentHTML("afterbegin", html);

const replaceHTML = (el, html) => {
    el.replaceChildren();
    insertHTML(el, html)
}

class State {
    constructor (value) {
        this.value = value;
        this.callbacks = [];
    }
    async set(newValue) {
        this.value = newValue;
        await Promise.all(this.callbacks.map(callback => Promise.resolve().then(callback)));
    }
    attach(callback) {
        this.callbacks.push(callback)
    }
}

const server = "http://localhost:4000";
const playlists = new State([]);
const currSelectedPlaylistId = new State(null);
const songList = new State([])
const currentSongId = new State(null)
const isPlaying = new State(false)
const isSongsLoading = new State(false)

const findPlaylistById = (id) => {
    return playlists.value.find((p) => p.id == id)
}

playlists.attach(()=>renderSidebarPlaylists())
currSelectedPlaylistId.attach(async ()=>{
    renderSidebarPlaylists()
    const currPlaylist = findPlaylistById(currSelectedPlaylistId.value)
    document.getElementById('playlist-cover').src = currPlaylist.cover
    isSongsLoading.set(true)
    const response = await fetch(`${server}/api/songs?id=${currSelectedPlaylistId.value}`)
    const data = await response.json()
    isSongsLoading.set(false)
    songList.set(data.songs)
    if (currentSongId.value == null)
        currentSongId.set(data.songs[0].id)
})

isSongsLoading.attach(()=>renderSongList())

songList.attach(()=>{
    renderSongList()
    renderPlayer()
})

currentSongId.attach(()=>{
    const audio = document.getElementById('audio')
    if (currentSongId.value) {
        audio.src = `${server}/api/audio/stream`
    }
    renderPlayer()
    renderSongList()
})
isPlaying.attach(()=>{
    const audio = document.getElementById('audio')
    if (isPlaying.value) audio.play()
    else audio.pause()
    renderPlayer()
    renderSongList()
})


export {replaceHTML, isSongsLoading, currentSongId, isPlaying, songList, playlists, server, currSelectedPlaylistId}