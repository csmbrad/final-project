fetch("/mydata")
    .then(response => response.json())
    .then(json => {
        document.getElementById("userFlag").src = json.flag
        document.getElementById("userAvatar").src = json.avatar
        document.getElementById("userHandle").innerText = json.username
    })
updateGalleryDisplay().then()

console.log(sessionStorage.getItem("friendData"))

async function updateGalleryDisplay() {

    //handle drawings here
    let drawings = await getDrawings()
    const gallery = document.querySelector('#gallery')
    let galleryItems = []

    for (let i = 0; i < drawings.length; i++) {

        let cardTitle = document.createElement('h4')
        cardTitle.classList.add('card-text')
        cardTitle.innerText = drawings[i].title

        let cardHeader = document.createElement('div')
        cardHeader.classList.add('card-header')
        cardHeader.appendChild(cardTitle)

        let galleryThumb = document.createElement('img')
        galleryThumb.setAttribute('id', 'galleryThumb')
        galleryThumb.classList.add('card-img-top')
        galleryThumb.src = drawings[i].URI

        let cardArtist = document.createElement('div')
        cardArtist.classList.add('card-text')
        cardArtist.innerText = drawings[i].artist

        let viewButton = document.createElement('a')
        viewButton.setAttribute('href', drawings[i].URI)
        viewButton.classList.add('btn-light')
        viewButton.classList.add('btn-sm')
        viewButton.innerText = 'View'

        let cardFooter = document.createElement('div')
        cardFooter.classList.add('card-footer')
        cardFooter.classList.add('bg-transparent')
        cardFooter.appendChild(cardArtist)
        cardFooter.appendChild(viewButton)


        let card = document.createElement('div')
        card.classList.add('card')
        card.classList.add('bg-dark')
        card.classList.add('text-center')
        card.appendChild(cardHeader)
        card.appendChild(galleryThumb)
        card.appendChild(cardFooter)

        let container = document.createElement('div')
        container.classList.add('col-md-3')
        container.appendChild(card)
        galleryItems.push(container)
    }
    galleryItems.forEach(drawing =>{
        gallery.appendChild(drawing)
    })
}

function getDrawings() {

    let artist = sessionStorage.getItem("friendData") // Pull value set by home

    // Get friend data by username
    return fetch("/drawings", {
        method: "POST",
        body: JSON.stringify({artist: artist}),
        headers: {"Content-Type": "application/json"}
    })
        .then(response => response.json())
        .then(json => {
            return json
        })
}
