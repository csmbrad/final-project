const express = require('express')
const exphbs = require('express-handlebars')
const {MongoClient} = require('mongodb');
const passport = require("passport");
const GitHubStrategy = require('passport-github').Strategy
const cookieSession = require('cookie-session')

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


////////////////////////////////// OAuth things //////////////////////////////////
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile)
    }
))

passport.serializeUser((user, done)=> {
    done(null, user.username)       // put username in cookie
})

passport.deserializeUser((username, done)=> {
    done(null, getUser(username))   // attach user property to request object
})

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 10000,   // login cookies expire after one day
    keys: [process.env.COOKIE_KEY]  // encrypt cookie based on env variable: COOKIEKEY
}))

app.use(passport.initialize())
app.use(passport.session())


////////////////////////////////// Routes //////////////////////////////////
app.get('/', (req, res) => {

    if (req.user !== undefined) {
        req.user.then(user => {console.log(user)})
        // Do something with the user data here

    }


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

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });


// start listening on PORT
app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})

////////////////////////////////// Database things //////////////////////////////////
let DBclient = null;
async function initConnection() {
    const uri = `mongodb+srv://PixelTalk:${process.env.PASSWORD}@cluster0.aaowb.mongodb.net/<dbname>?retryWrites=true&w=majority`
    DBclient = new MongoClient(uri, { useUnifiedTopology: true })
    await DBclient.connect()
}

async function getUser(username) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebwareFinal").collection("UserData")
    return await collection.findOne({username: username})
}

async function upsertUser(userData) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebwareFinal").collection("UserData")
    collection.updateOne(
        { username: userData.username },
        { $set: userData },
        { upsert: true });
}

function cleanup() {
    console.log("Cleaning up...")
    if (DBclient) DBclient.close()
    process.exit(0)
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)

//upsertUser({username: "noahvolson", inbox: "FULL OF MAIL"})
//getUser("noahvolson").then(r => console.log(r))