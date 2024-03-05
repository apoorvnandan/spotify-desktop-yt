import { replaceHTML, isPlaying, currentSongId, songList, server } from "./state.js";
import { HeartIconEmpty, HeartIconFull, PauseIcon, PlayIcon, ShuffleIcon } from "../components.js";

window.handlePlayPause = () => {
    isPlaying.set(!isPlaying.value)
}


window.handleLikeDislike = async (id) => {
    let updatedSongList = songList.value.map((s) => {
        if (s.id == id) {
            return {...s, like: !s.like}
        } else {
            return s
        }
    })
    songList.set(updatedSongList)
    const response = await fetch(`${server}/api/song/like`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            songId: id
        })
    })
    const data = await response.json()
    if (data.done) {
        return
    }
    updatedSongList = songList.value.map((s) => {
        if (s.id == id) {
            return {...s, like: !s.like}
        } else {
            return s
        }
    })
    songList.set(updatedSongList)
}

const renderPlayer = () => {
    const currentSong = songList.value.find((s)=>s.id == currentSongId.value)
    let h = `
    <button onclick="handleLikeDislike('${currentSongId.value}')" class="w-8 ${currentSong && currentSong.like ? 'text-green-500' : ''}">
        ${currentSong && currentSong.like ? HeartIconFull() : HeartIconEmpty()}
    </button>
    <button onclick="handlePlayPause()">
        ${isPlaying.value ? PauseIcon(): PlayIcon()}
    </button>
    <button>
        ${ShuffleIcon()}
    </button>
    `
    const el = document.getElementById('player')
    replaceHTML(el, h)
}

export {renderPlayer};