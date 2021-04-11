const express = require('express');
const app = express();
const ytsr = require('./ytsr');
const ytdl = require('./ytdl');
const cors = require('cors');

app.use(cors());
app.use(express.static('./build'))

app.get('/', (req, res) => {
    res.sendFile('./build/index.html')
})

app.use('/download', ytdl);
app.use('/query', ytsr);

app.listen(4000, () => console.log('Express server started on port 4000'));


