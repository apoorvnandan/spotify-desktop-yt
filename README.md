Streaming Server APIs

```
GET /api/playlists
- returns list of playlist objects

GET /api/songs?id={playlist_id}
- return list of songs for given playlist

POST /api/song/like
- toggles like/dislike for given song id

GET /api/audio/stream
- streams the sample audio file
```

Electron Frontend

- plain javascript frontend
