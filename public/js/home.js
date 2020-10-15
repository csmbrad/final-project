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
    console.log(myData)
    let friends = myData.friends
    let container = document.getElementById("friendsDisplay")
    let rows = []

    for (let i = 0; i < friends.length; i++) {
        if (i % 3 === 0) {
            let newRow = document.createElement("div")
            newRow.classList.add("row")
            rows.push(newRow)
        }

        // Get friend data by
        let friend = null
        fetch("/friend", {
            method:"POST",
            body:JSON.stringify({friendUsername:friends[i]}),
            headers: { "Content-Type": "application/json"}
        })
            .then(response => response.json())
            .then(json => {
               friend = json
                console.log(friend)
            })


        let newCard = document.createElement("h1")
        newCard.innerText = friends[i]
        rows[rows.length - 1].appendChild(newCard) // add to the freshest row
    }

    rows.forEach(row => {
        container.appendChild(row)
    })
}