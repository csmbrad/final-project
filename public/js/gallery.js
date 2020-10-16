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

    let drawings = await getDrawings()
    console.log(drawings)

    //handle drawings here
    const gallery = document.querySelector('#gallery')

    let myGallery = ''
    for (let i = 0; i < drawings.length; i++) {
        let template = `
          <div class="col-md-3">
            <div class="card bg-dark text-center">
            <div class="card-header">
            <h4 class="card-text">${drawings[i].title}</h4>
            </div>
                <img id="galleryThumb" class="card-img-top" src="${drawings[i].URI}">
                    <div class="card-img-overlay text-dark">
                    </div>
                        <div class="card-footer bg-transparent">
                        <div class="card-text">${drawings[i].artist}</div>
                        <button type="button" class="btn btn-light btn-sm">View</button>
                        </div>
                        </div>
            </div>
        </div>`

        myGallery += template
    }
//console.log(myGallery)
    console.log(myGallery)
    gallery.innerHTML = myGallery
}


function getDrawings () {

    let artist = sessionStorage.getItem("friendData") // Pull value set by home

    // Get friend data by username
    return fetch("/drawings", {
        method:"POST",
        body:JSON.stringify({artist: artist}),
        headers: { "Content-Type": "application/json"}
    })
        .then(response => response.json())
        .then(json => {
            return json
        })
}
