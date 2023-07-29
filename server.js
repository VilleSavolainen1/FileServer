require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const bcrypt = require('bcrypt');
const app = express();
const knex = require('knex');
const fs = require('fs-extra');
const multer = require('multer');



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
    res.send("saved")
})

app.post('/save-name', (req, res) => {
    let { file, folder } = req.body;
    try {
        db.insert({ file: file, folder: folder })
            .into('files')
            .then(res => {
                console.log("added")
            })
    }catch(e){
        console.log(e)
    }
    return res.json({ status: 'ok' })
})


app.get('/filenames', (req, res) => {
    db.select('*').from('files').then(files => {
        res.json(files)
    })
        .catch(err => res.status(400).json('Not found'))
})


app.post('/files', (req, res) => {
    let { filename } = req.body;
    res.sendFile(__dirname + '/files/' + filename)
})


app.get('/download/:filename(*)', (req, res) => {
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
                .then(loginName => {
                    return trx('login').insert({
                        name: username,
                        joined: new Date()
                    })
                        .then(user => {
                            res.json(user[0])
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


app.post('/signin', (req, res) => {
    db.select('username', 'password').from('users')
        .where('username', '=', req.body.username)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].password);
            if (isValid) {
                return db.select('*').from('login')
                    .where('name', '=', req.body.username)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).send(err))
            } else {
                res.status(500).json("väärin")
            }
        })
        .catch(err => res.status(400).json(err))
})


app.post('/create-folder', (req, res) => {
    let { folder } = req.body;
    db.insert({ name: folder }).into('folders')
        .then(r => {
            console.log("created")
            res.send("created")
        })
})

app.get('/folders', (req, res) => {
    db.select('*').from('folders')
        .then(r => {
            res.send(r)
        })
})

app.post('/delete', (req, res) => {
    let {file, id} = req.body;
    db.delete().from('files').where('id', '=', id).then(msg => {
        res.json("deleted")
    })
    fs.unlink(__dirname + '/files/' + file, (err) => {
        if(err) throw err;
        console.log("file deleted")
    })
})

app.post('/deletefolder', (req, res) => {
    let {folder} = req.body;
    db.delete().from('folders').where('name', '=', folder)
    .then(msg => {
        res.json("deleted");
    })
})

app.listen(process.env.port, () => console.log("server started on port", process.env.port))