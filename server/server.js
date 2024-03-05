import express from 'express';
import * as fs from 'fs';
import {playlists, songs, allSongs} from './sample_playlists_data.js'
const app = express()

app.use(express.json())

app.get('/api/playlists', (req, res) => {
    res.status(200).json({playlists})
})

app.get('/api/songs', (req, res) =>{
    setTimeout(()=>{
        const playlistId = req.query.id;
        res.status(200).json({songs:allSongs[playlistId]})
    }, 100)
})

const getStreamStartEnd = (filePath, range) => {
    const audioSize = fs.statSync(filePath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
    const contentLen = end - start + 1;
    return {start, end, audioSize, contentLen}
}

app.get('/api/audio/stream', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send('Requires range header')
    }
    const filePath = './sample.mp3';
    const {start, end, audioSize, contentLen} = getStreamStartEnd(filePath, range)

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${audioSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLen,
        'Content-Type': 'audio/mp3'
    }

    res.writeHead(206, headers)
    const audioStream = fs.createReadStream(filePath, {start, end});
    audioStream.pipe(res)
})

const findPlaylistIdFromSongId = (songId) => {
    for (const [key, value] of Object.entries(allSongs)) {
        // console.log(`${key}: ${value}`);
        for (let s of allSongs[key]) {
            if (s.id == songId) {
                return key
            }
        }
    }
    return null
} 

app.post('/api/song/like', (req, res) => {
    const {songId} = req.body;
    const playlistId = findPlaylistIdFromSongId(songId)    
    const updatedSongs = allSongs[playlistId].map((s) => {
        if (s.id == songId) {
            return {...s, like: !s.like}
        } else {
            return s
        }
    })
    allSongs[playlistId] = updatedSongs
    res.status(200).json({done: true})
})

app.get('/api/hello', (req, res) => {
    res.status(200).json({value:1234})
})

app.listen(4000, ()=>{
    console.log('running')
})