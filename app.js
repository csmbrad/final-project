const express = require('express')
const exphbs = require('express-handlebars')
const {MongoClient} = require('mongodb');
const passport = require("passport");
const GitHubStrategy = require('passport-github').Strategy
const cookieSession = require('cookie-session')
//require('dotenv').config()
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

const PORT = 3000
const app = express()

let date = new Date()
let formattedDate = date.toLocaleDateString('en-US')


/////////////////////////////// General Middleware  ///////////////////////////////

// serve favicon
app.use(favicon(__dirname + "/public/images/favicon.ico"));

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


// ================ GET ================

// home route
app.get('/', (req, res) => {
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        req.user.then(user => {

            // send user data back
            res.sendFile(__dirname + "/views/index.html");
        })
    }
    else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

// in case index.html specified
app.get("/index.html", (req, res) => {
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        req.user.then(user => {

            // send user data back
            res.sendFile(__dirname + "/views/index.html");
        })
    }
    else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

app.get("/gallery.html", (req, res) => {
    res.sendFile(__dirname + "/views/gallery.html");
})

app.get('/mydata', (req, res) => {
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        req.user.then(user => {

            // send user data back
            res.json(user)
        })
    }
})

app.get("/inbox", (req, res) => {
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        req.user.then(user => {


            // send user's inbox back
            getInbox(user.username).then(drawings => {

                let drawingArray = []
                drawings.forEach(drawing=>{
                    drawingArray.push(drawing)
                }).then(()=>{
                    // send drawing data back
                    res.json(drawingArray)
                })
            })
        })
    }
})

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        getUser(req.user.username).then(result => {
            if (result === null) {
                // Create new entry in DB
                upsertUser({
                    username: req.user.username,
                    avatar: '/images/placeholder_avatar.png',      // Some placeholder image here (maybe github icon?)
                    flag: '/images/flags/mexico.png',   // Grab flag from IP???
                    friends: ["user1","user2","user3","user4","user5"]
                }).then(res.redirect('/'))
            }
            else { // User found
                res.redirect('/')
            }
        })
    })

app.get("/logout", (req, res) => {
    if (req.user !== undefined) {
        req.logOut();
    }
    res.redirect('/');
})

// ================ POST ================

app.post('/friend', bodyParser.json(),  (req, res) => {
    getUser(req.body.friendUsername).then(friendData => {
        // send friend data back
        res.json(friendData)
    })
})

app.post('/drawings', bodyParser.json(),  (req, res) => {

    req.user.then(user => {
        getConversation(req.body.artist, user.username).then(drawings => {

            let drawingArray = []
            drawings.forEach(drawing=>{
                drawingArray.push(drawing)
            }).then(()=>{
                // send drawing data back
                res.json(drawingArray)
            })
        })
    })
})

app.post('/send', bodyParser.json(),  (req, res) => {
    req.body.artist = 'user1' // TODO REPLACE WITH CLIENT USERNAME
    //console.log(req.body)
    insertDrawing(req.body).then()
})

app.post('/pfp', bodyParser.json(),  (req, res) => {
    //console.log(req)
    if (req.user !== undefined && req.user !== null) { // if user has logged in
        
        req.user.then(user => {
            let updatedUser = {
                username: user.username,
                avatar: req.body.avatar,      // Some placeholder image here (maybe github icon?)
                flag: user.flag,   // Grab flag from IP???
                friends: user.friends
            }
            console.log(updatedUser)
            upsertUser(updatedUser)
                .then(res.json(updatedUser))
        })
    }
})

// start listening on PORT
app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})

////////////////////////////////// Database things //////////////////////////////////
let DBclient = null;
async function initConnection() {
    const uri = `mongodb+srv://PixelTalk:${process.env.PASSWORD}@cluster0.aaowb.mongodb.net/<dbname>?retryWrites=true&w=majority`
    DBclient = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    await DBclient.connect()
}

async function getUser(username) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebwareFinal").collection("UserData")
    return await collection.findOne({username: username})
}

async function getConversation(artist, receiver) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebwareFinal").collection("Drawings")
    return await collection.find({artist: artist, receiver:receiver})
}

async function getInbox(receiver) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebwareFinal").collection("Drawings")
    return await collection.find({receiver:receiver})
}

async function upsertUser(userData) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebwareFinal").collection("UserData")
    collection.updateOne(
        { username: userData.username },
        { $set: userData },
        { upsert: true });
}

async function insertDrawing(drawing) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebwareFinal").collection("Drawings")
    await collection.insertOne(drawing)
}

////////////////////////////////// Graceful Termination //////////////////////////////////
function cleanup() {
    console.log("Cleaning up...")
    if (DBclient) DBclient.close()
    process.exit(0)
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)