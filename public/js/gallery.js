console.log('gallery.js')

//called when user successfully logs in
fetch('/mydata')
    .then(response => response.json())
    .then(userData => {
        document.querySelector('#userFlag').src = userData.flag
        document.querySelector('#userAvatar').src = userData.avatar
        document.querySelector('#userHandle').innerText = userData.username

        let drawings = [
            {
                title: "Title",
                artist: "Username",
                receiver: "nah",
                URI: 'images/300.jpg',
                instructions: []
            },
            {
                title: "Title",
                artist: "Username",
                receiver: "nah",
                URI: 'images/300.jpg',
                instructions: []
            },
            {
                title: "Title",
                artist: "Username",
                receiver: "nah",
                URI: 'images/300.jpg',
                instructions: []
            }]

        const gallery = document.querySelector('#gallery')
        console.log(gallery)

        let myGallery = ''
        for (let i = 0; i < drawings.length; i++) {
            let template = `
          <div class='col-md-3'>
            <div class='card bg-dark text-center'>
            <div class='card-header'>
            <h4 class='card-text'>${drawings[i].title}</h4>
            </div>
                <img id='galleryThumb' class='card-img-top' src='${drawings[i].URI}'>
                    <div class='card-img-overlay text-dark'>
                    </div>
                        <div class='card-footer bg-transparent'>
                        <div class='card-text'>${drawings[i].artist}</div>
                        <button type='button' class='btn btn-light btn-sm'>View</button>
                        </div>
                        </div>
            </div>
        </div>`
            myGallery += template
        }
        console.log(myGallery)

        gallery.innerHTML = myGallery
    })


