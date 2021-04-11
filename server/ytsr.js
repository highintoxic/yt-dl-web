const ytsr = require('ytsr');
const express = require('express');
const router = express.Router()

let kek = 0;

router.get("/", async (req, res, next) => {
    if(!req.query.q) return res.send([])
    const data = await ytsr(req.query.q, { limit: 10 });
    res.send(data.items)
    kek++
    console.log(kek)
    next()
})

module.exports = router