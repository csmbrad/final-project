const express = require('express')
const exphbs = require('express-handlebars')
const {MongoClient} = require('mongodb');

const PORT = 3000
const app = express()

let date = new Date()
let formattedDate = date.toLocaleDateString('en-US')


let drawings = {
    d1: {
        title: 'The Ocean',
        artist: 'JimBob212',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    },
    d2: {
        title: 'Bell Peppers',
        artist: 'PennyPancake',
        img: 'images/drawings/four.jpeg',
        date: formattedDate
    },
    d3: {
        title: 'The Forest',
        artist: 'ElvenWarrior34',
        img: 'images/drawings/one.jpeg',
        date: formattedDate
    },
    d4: {
        title: 'The Ocean',
        artist: 'CheerioMcB',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    },
    d5: {
        title: 'The Ocean',
        artist: 'KenJakovis',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    },
    d6: {
        title: 'The Ocean',
        artist: 'KenJakovis',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    },
    d7: {
        title: 'The Ocean',
        artist: 'KenJakovis',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    },
    d8: {
        title: 'The Ocean',
        artist: 'KenJakovis',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    },
    d9: {
        title: 'The Ocean',
        artist: 'KenJakovis',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    },
    d10: {
        title: 'The Ocean',
        artist: 'KenJakovis',
        img: 'images/drawings/three.jpeg',
        date: formattedDate
    }
}


// set template rendering engine to use handlebars
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


// server static files from dir 'public'
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('gallery', {
        layout: false,
        // populate page with data from database
        userData: {
            username: "HScorpio92",
            avatar: '/images/user_01.png',
            flag: '/images/flags/nepal.png',
            drawings: drawings
        }
    })
})

// start listening on PORT
app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})

////////////////////////////////// Database things //////////////////////////////////
let client = null;
async function initConnection() {
    const uri = `mongodb+srv://PixelTalk:${process.env.PASSWORD}@cluster0.aaowb.mongodb.net/<dbname>?retryWrites=true&w=majority`
    client = new MongoClient(uri, { useUnifiedTopology: true })
    await client.connect()
}

async function getUser(username) {
    if (client === null) {await initConnection()}
    let collection = client.db("WebwareFinal").collection("UserData")
    return await collection.findOne({username: username})
}

async function upsertUser(userData) {
    if (client === null) {await initConnection()}
    let collection = client.db("WebwareFinal").collection("UserData")
    collection.updateOne(
        { login: userData.login },
        { $set: userData },
        { upsert: true });
}

function cleanup() {
    console.log("Cleaning up...")
    if (client) client.close()
    process.exit(0)
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)

//upsertUser({username: "thelegend27", inbox: "FULL OF MAIL"})
getUser("thelegend27").then(r => console.log(r))