const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const express = require('express')
const favicon = require("serve-favicon");
const GitHubStrategy = require('passport-github').Strategy
const IPinfo = require("node-ipinfo");
const passport = require("passport");
const {MongoClient} = require('mongodb');

const PORT = 3000
const app = express()


/////////////////////////////// General Middleware  ///////////////////////////////

// serve favicon
app.use(favicon(__dirname + "/public/images/favicon.ico"));


// server static files from dir 'public'
app.use(express.static('public'))


////////////////////////////////// OAuth things //////////////////////////////////
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile)
    }
))

passport.serializeUser((user, done) => {
    done(null, user.username)       // put username in cookie
})

passport.deserializeUser((username, done) => {
    done(null, getUser(username))   // attach user property to request object
})

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 10000,   // login cookies expire after one day
    keys: [process.env.COOKIE_KEY]  // encrypt cookie based on env variable: COOKIEKEY
}))

app.use(passport.initialize())
app.use(passport.session())


////////////////////////////////// Routes //////////////////////////////////


// ================ GET ================

// home route
app.get('/', (req, res) => {
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        req.user.then(user => {
            console.log("logged in: " + user.username)

            // send user data back
            res.sendFile(__dirname + "/views/index.html");
        })
    } else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

// in case index.html specified
app.get("/index.html", (req, res) => {
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        req.user.then(user => {
            console.log("logged in: " + user.username)

            // send user data back
            res.sendFile(__dirname + "/views/index.html");
        })
    } else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

app.get('/mydata', (req, res) => {
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        req.user.then(user => {

            // send user data back
            res.json(user)
        })
    }
})

app.get("/gallery.html", (req, res) => {
    res.sendFile(__dirname + "/views/gallery.html");
})

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/'}),
    function (req, res) {
        getUser(req.user.username).then(result => {
            if (result === null) {
                //get country code for flag
                ipToFlagPath(req).then((flagPath) => {
                    // Create new entry in DB
                    upsertUser({
                        username: req.user.username,
                        avatar: '/images/placeholder_avatar.png',      // Some placeholder image here (maybe github icon?)
                        flag: flagPath,
                        friends: ["user1", "user2", "user3", "user4", "user5"]
                    }).then(res.redirect('/'))
                })
            } else { // User found
                res.redirect('/')
            }
        })
    })


app.get("/logout", (req, res) => {
    if (req.user !== undefined) {
        req.user.then(user => {
            console.log("Log out requested for: " + user.username)
        })
        req.logOut();
    }
    res.redirect('/');
})

// ================ POST ================

app.post('/friend', bodyParser.json(), (req, res) => {
    getUser(req.body.friendUsername).then(friendData => {
        // send friend data back
        res.json(friendData)
    })
})

app.post('/drawings', bodyParser.json(), (req, res) => {

    req.user.then(user => {
        getDrawings(req.body.artist, user.username).then(drawings => {

            let drawingArray = []
            drawings.forEach(drawing => {
                drawingArray.push(drawing)
            }).then(() => {
                // send drawing data back
                res.json(drawingArray)
            })
        })
    })
})


app.post('/uploadDrawing', bodyParser.json(), (req, res)=> {
       insertDrawing(req.body).then(()=>{
           console.log(`Added ${req.body}`)
       })
    }
)

app.post('/send', bodyParser.json(), (req, res) => {
    console.log(req.body)
})


// start listening on PORT
app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})

////////////////////////////////// Database things //////////////////////////////////
let DBclient = null;

async function initConnection() {
    const uri = `mongodb+srv://PixelTalk:${process.env.PASSWORD}@cluster0.aaowb.mongodb.net/<dbname>?retryWrites=true&w=majority`
    DBclient = new MongoClient(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    await DBclient.connect()
}

async function getUser(username) {
    if (DBclient === null) {
        await initConnection()
    }
    let collection = DBclient.db("WebwareFinal").collection("UserData")
    return await collection.findOne({username: username})
}

async function getDrawings(artist, receiver) {
    if (DBclient === null) {
        await initConnection()
    }
    let collection = DBclient.db("WebwareFinal").collection("Drawings")
    return await collection.find({
        artist: artist,
        receiver: receiver
    })
}

async function upsertUser(userData) {
    if (DBclient === null) {
        await initConnection()
    }
    let collection = DBclient.db("WebwareFinal").collection("UserData")
    collection.updateOne(
        {username: userData.username},
        {$set: userData},
        {upsert: true});
}

async function insertDrawing(drawing) {
    if (DBclient === null) {
        await initConnection()
    }
    let collection = DBclient.db("WebwareFinal").collection("Drawings")
    collection.insertOne(drawing)
}


///////////////////////////////////// Geolocation ///////////////////////////////////////
const token = process.env.IPINFO_TOKEN
const ipinfo = new IPinfo(token);

async function ipToCountryCode(req) {
    let clientIP
    try {
        clientIP = req.headers['x-forwarded-for'].split(',')[0]
    } catch (TypeError) {
        console.log('no ip')
        return null
    }
    return ipinfo.lookupIp(clientIP)
}

async function ipToFlagPath(req) {
    let cc = await ipToCountryCode(req)
    if (cc === null) {
        return `images/flags/PF.png`
    } else {
        return `images/flags/${cc._countryCode}.png`
    }
}


////////////////////////////////// Graceful Termination //////////////////////////////////
function cleanup() {
    console.log("Cleaning up...")
    if (DBclient) DBclient.close()
    process.exit(0)
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)
