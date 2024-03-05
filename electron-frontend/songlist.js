import { songList, replaceHTML, currentSongId, isPlaying, isSongsLoading } from "./state.js"
import { HeartIconEmpty, HeartIconFull } from "../components.js";

const htmlSongItem = (song, idx) => {
    const isThisSongPlaying = song.id == currentSongId.value && isPlaying.value
    return `<div onclick="handleSongClick('${song.id}')" class="group w-full ${song.id == currentSongId.value? 'text-green-500':'text-neutral-400'} hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neutral-800 flex items-center px-6 py-3 cursor-pointer">
        ${isThisSongPlaying? `<div class="w-6 h-6"><img class="w-full h-full" src="assets/playing-audio.svg"/></div>`: `
            <div class="w-6 h-6 grow-0 shrink-0 flex group-hover:hidden items-center ">#${idx + 1}</div>
            <div class="w-6 h-6 items-center hidden group-hover:flex">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.98951C5 4.01835 5 3.53277 5.20249 3.2651C5.37889 3.03191 5.64852 2.88761 5.9404 2.87018C6.27544 2.85017 6.67946 3.11953 7.48752 3.65823L18.0031 10.6686C18.6708 11.1137 19.0046 11.3363 19.1209 11.6168C19.2227 11.8621 19.2227 12.1377 19.1209 12.383C19.0046 12.6635 18.6708 12.886 18.0031 13.3312L7.48752 20.3415C6.67946 20.8802 6.27544 21.1496 5.9404 21.1296C5.64852 21.1122 5.37889 20.9679 5.20249 20.7347C5 20.467 5 19.9814 5 19.0103V4.98951Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
        `}
        <div class="pl-4 w-10 h-10 grow-0 shrink-0 items-center">
            <img class="object-cover w-full h-full" src="${song.image}"/>
        </div>
        <div class="grow pl-4">${song.title}</div>
        <div class="w-6 h-6 grow-0 shrink-0">
            ${song.like ? HeartIconFull() : HeartIconEmpty()}
        </div>
        <div class="pl-4">${song.duration}</div>
    </div>`
}

window.handleSongClick = (id) => {
    currentSongId.set(id)
    isPlaying.set(true)
}

const renderSongList = () => {
    const el = document.getElementById('song-list')
    if (isSongsLoading.value) {
        const h = `<div class="w-full h-full flex items-center justify-center">
            <img class="w-10 h-10" src="assets/spinning-circles-loader.svg"/>
        </div>`
        replaceHTML(el, h)
        return
    }
    let h = ``
    let idx = 0;
    for (let song of songList.value) {
        h += htmlSongItem(song, idx)
        idx += 1
    }
    replaceHTML(el, h)
}

export {renderSongList}