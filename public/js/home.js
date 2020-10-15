console.log("home.js")

let myData = null
fetch("/mydata")
    .then(response => response.json())
    .then(json => {
        myData = json
        updateFriendsDisplay(myData)
    })


function updateFriendsDisplay(myData) {

    // Will need to pull data for each friend

    let friends = ["1,","2,","3,","4,","5,","6,","7,","8,","9,","10,","11,"] //myData.friends
    let container = document.getElementById("friendsDisplay")
    let rows = []

    for (let i = 0; i < friends.length; i++) {
        if (i % 3 === 0) {
            let newRow = document.createElement("div")
            newRow.classList.add("row")
            rows.push(newRow)
        }
        let newCard = document.createElement("h1")
        newCard.innerText = friends[i]
        rows[rows.length - 1].appendChild(newCard) // add to the freshest row
    }

    rows.forEach(row => {
        container.appendChild(row)
    })
}