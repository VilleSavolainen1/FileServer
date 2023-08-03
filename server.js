require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const bcrypt = require('bcrypt');
const app = express();
const knex = require('knex');
const fs = require('fs-extra');
const multer = require('multer');
const jwt = require('jsonwebtoken')


const db = knex({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use('/files', express.static('files'));
app.use(express.static('./frontend/fileserver/build'));


const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files')
    },
    filename: (req, file, cb) => {
        const date = new Date();
        const fileName = file.originalname.toLowerCase();
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    res.send("saved")
})

app.post('/save-name', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { file, folder } = req.body;
    try {
        db.insert({ file: file, folder: folder })
            .into('files')
            .then(res => {
                console.log("added")
            })
    } catch (e) {
        console.log(e)
    }
    return res.json({ status: 'ok' })
})


app.get('/filenames', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    db.select('*').from('files').then(files => {
        res.json(files)
    })
        .catch(err => res.status(400).json('Not found'))
})


app.post('/files', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { filename } = req.body;
    res.sendFile(__dirname + '/files/' + filename)
})


app.get('/download/:filename(*)', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let file = req.params.filename;
    res.download(__dirname + '/files/' + file, file)
})



app.post('/register', async (req, res) => {
    let { username, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await db.transaction(trx => {
            trx.insert({ username: username, password: hash })
                .into('users')
                .returning('username')
                .then(trx.commit)
                .catch(trx.rollback)
            res.json(username)
        })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

// Sign in
app.post('/signin', (req, res) => {
    db.select('username', 'password').from('users')
        .where('username', '=', req.body.username)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].password);
            if (isValid) {
                const userForToken = {
                    username: req.body.username,
                    password: req.body.password
                }

                const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
                res.json({ token, username: req.body.username })
            } else {
                res.status(500).json("väärin")
            }
        })
        .catch(err => res.status(400).json(err))
})


app.post('/create-folder', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { folder } = req.body;
    db.insert({ name: folder }).into('folders')
        .then(r => {
            console.log("created")
            res.send("created")
        })
})

app.get('/folders', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    db.select('*').from('folders')
        .then(r => {
            res.json(r)
        })
})

app.post('/delete', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { file, id } = req.body;
    db.delete().from('files').where('id', '=', id).then(msg => {
        res.json("deleted")
    })
    fs.unlink(__dirname + '/files/' + file, (err) => {
        if (err) throw err;
        console.log("file deleted")
    })
})

app.post('/deletefolder', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { folder } = req.body;
    db.delete().from('folders').where('name', '=', folder)
        .then(msg => {
            res.json("deleted");
        })
})

app.listen(process.env.port, () => console.log("server started on port", process.env.port))