console.log("home.js")

fetch("/mydata")
    .then(response => response.json())
    .then(json => {
        document.getElementById("userFlag").src = json.flag
        document.getElementById("userAvatar").src = json.avatar
        document.getElementById("userHandle").innerText = json.username
        updateFriendsDisplay(json).then()
    })


async function updateFriendsDisplay(myData) {

    // Will need to pull data for each friend
    let friends = myData.friends
    let container = document.getElementById("friendsDisplay")
    let rows = []

    for (let i = 0; i < friends.length; i++) {
        if (i % 4 === 0) {
            let newRow = document.createElement("div")
            newRow.classList.add("row")
            rows.push(newRow)
        }

        // Get friend data by username
        let friendData = await getFriendData(friends[i])

        let title = document.createElement("h5")
        title.classList.add("card-title")
        title.classList.add("text-center")
        title.innerText = friendData.username

        let overlay = document.createElement("div")
        overlay.classList.add("card-img-overlay")
        overlay.appendChild(title)

        let avatar = document.createElement("img")
        avatar.src = friendData.avatar
        avatar.classList.add("card-img-bottom")
        avatar.alt = "avatar for " + friendData.username

        let card = document.createElement("div")
        card.classList.add("card")
        card.classList.add("mb-4")
        card.classList.add("box-shadow")
        card.classList.add("bg-dark")
        card.appendChild(avatar)
        card.appendChild(overlay)

        let container = document.createElement("div")
        container.classList.add("col-md-3")
        container.appendChild(card)
        container.onclick = function () {
            console.log("Clicked + " + friendData.username)
            sessionStorage.setItem("friendData",friendData.username)
            document.location.href = "/gallery.html";
        }

        rows[rows.length - 1].appendChild(container) // add to the freshest row

    }

    rows.forEach(row => {
        container.appendChild(row)
    })
}

function getFriendData (friendUsername) {

    // Get friend data by username
    return fetch("/friend", {
        method:"POST",
        body:JSON.stringify({friendUsername:friendUsername}),
        headers: { "Content-Type": "application/json"}
    })
        .then(response => response.json())
        .then(json => {
            return json
        })
}
