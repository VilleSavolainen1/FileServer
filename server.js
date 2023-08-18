require("dotenv").config();
const { createServer } = require('http')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const bcrypt = require('bcrypt');
const app = express();
const knex = require('knex');
const fs = require('fs-extra');
const multer = require('multer');
const jwt = require('jsonwebtoken')
const path = require('path')
const checkDiskSpace = require('check-disk-space').default
const httpServer = createServer(app)
const { Server } = require('socket.io')

const io = new Server(httpServer, {
    cors: {
        origin: "http://165.22.80.179",
        methods: ["GET", "POST"]
    }
})

app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE
    }
});

let users = []

io.on('connection', (socket) => {
    console.log('user connected ', socket.id)
    socket.on("send_message", (data) => {
        io.emit("receive_message", data)
    })

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));


    //Listens when a new user joins the server
    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        users.push(data);
        console.log(users);
        //Sends the list of users to the client
        io.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        io.emit('newUserResponse', users);
        socket.disconnect();
    });
})


// /files folder
const filesPathOnServer = path.join(__dirname, '..', '..', '..', '/files/')
const filesPathOnTest = path.join(__dirname, '..', '/files/')

app.use(bodyParser.json());
if (process.env.ENVIRONMENT === 'test') {
    app.use(filesPathOnTest, express.static('files'));
} else {
    app.use(filesPathOnServer, express.static('files'));
}

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
        cb(null, process.env.ENVIRONMENT === 'test' ? filesPathOnTest : filesPathOnServer)
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase();
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    res.send("saved")
})

app.post('/upload-array', upload.array('files', 5), function (req, res) {
    console.log(req.files)
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    res.send("saved")
})


app.post('/save-name', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
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
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    db.select('*').from('files').then(files => {
        res.json(files)
    })
        .catch(err => res.status(400).json('Not found'))
})


app.get('/files/:filename(*)', (req, res) => {
    let filename = req.params.filename;
    res.download(process.env.ENVIRONMENT === 'test' ? filesPathOnTest + filename : filesPathOnServer + filename)
})

/* app.get('/allfiles', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    res.sendFile(_dirname + '/files/')
}) */


app.get('/download/:filename(*)', (req, res) => {
    console.log('FILENAME: ', filename)
    let file = req.params.filename;
    res.download(process.env.ENVIRONMENT === 'test' ? filesPathOnTest + file : filesPathOnServer + file, file)
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
        .catch(err => res.status(400).json('Väärin'))
})


app.post('/create-folder', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { folder } = req.body;
    db.insert({ name: folder }).into('folders')
        .then(r => {
            res.send("created")
        })
})

app.get('/folders', (req, res) => {
    try {
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if (!decodedToken.username) {
            return res.status(401).json({ error: 'token invalid' })
        }
        db.select('*').from('folders')
            .then(r => {
                res.json(r)
            })
    } catch (err) {
        return res.status(401).json(err)
    }
})


app.post('/delete', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { file, id } = req.body;
    db.delete().from('files').where('id', '=', id).then(async msg => {
        res.json("deleted")
        try {
            await fs.unlink(process.env.ENVIRONMENT === 'test' ? filesPathOnTest + file.toLowerCase() : filesPathOnServer + file.toLowerCase())
            res.status(200)
        } catch (err) {
            res.status(500)
        }
    })
})

app.post('/deletefolder', (req, res) => {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.username) {
        return res.status(401).json({ error: 'token invalid' })
    }
    let { folder } = req.body;
    db.delete().from('folders').where('name', '=', folder)
        .then(msg => {
            res.json("deleted");
        })
})

app.get('/disk', (req, res) => {
    if (process.env.ENVIRONMENT === 'test') {
        checkDiskSpace('C:/Users').then((diskSpace) => {
            return res.status(200).json(diskSpace)
        }).catch(err => {
            return res.status(500).json(err)
        })
    } else {
        checkDiskSpace('/dev/vda1').then((diskSpace) => {
            return res.status(200).json(diskSpace)
        }).catch(err => {
            return res.status(500).json(err)
        })
    }
})

httpServer.listen(process.env.port, () => console.log("server started on port", process.env.port))