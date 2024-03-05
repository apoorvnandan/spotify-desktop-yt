import {server, playlists, replaceHTML, currSelectedPlaylistId} from './state.js';


document.addEventListener('DOMContentLoaded', async(event) => {
    const response = await fetch(`${server}/api/playlists`)
    const data = await response.json()
    playlists.set(data.playlists)
    currSelectedPlaylistId.set(playlists.value[0].id)
})

const htmlPlaylistItem = (playlist) => {
    return `<div onclick="handlePlaylistClick('${playlist.id}')" class="flex px-2 py-1 ${currSelectedPlaylistId.value == playlist.id ? 'text-neutral-300':'text-neutral-400'} hover:text-neutral-300 cursor-pointer">
        <p>${playlist.title}</p>
    </div>
    `
}

window.handlePlaylistClick = (id) => {
    currSelectedPlaylistId.set(id)
}

const renderSidebarPlaylists = () => {
    let h = ''
    for (let playlist of playlists.value) {
        h += htmlPlaylistItem(playlist)
    }
    const el = document.getElementById('sidebar-playlists')
    replaceHTML(el, h)
}

export {renderSidebarPlaylists};