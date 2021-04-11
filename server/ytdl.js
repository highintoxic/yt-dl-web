const ytdl = require('ytdl-core');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _next) => {
    const info = await ytdl.getInfo(req.query.id)
    const name = info.videoDetails.title.replace('|','').toString('ascii')
    res.header('Content-Disposition', `attachment; filename="${name}.mp3"`);
    res.header('Content-type', 'audio/mpeg');
    ytdl(req.query.id, {
        quality: 'highestaudio'
    })
    .pipe(res);
})

module.exports = router