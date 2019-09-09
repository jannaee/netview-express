function createUrl(hostname, showId, languageId, jsPath) {
    let url = hostname + "/shows/" + showId + "/lang/" + languageId + "/jsPath/" + jsPath;
    return url;
}

async function fetchAndProcess(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

// HACK - duplicated from loadmovies, need to consolidate
function getLanguageSelect() {
    let languageSelector = document.getElementById('language_select');
    let selectedIndex = languageSelector.selectedIndex;
    let selectedLanguage = languageSelector[selectedIndex].value;
    return selectedLanguage;
}


/************* Movie Hero Section ****************/
//HERO TITLE
async function loadHeading() {
    let headingResultsurl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.heading");
    let headingResults = fetchAndProcess(headingResultsurl)
        .then(response => {
            const titleEl = document.getElementById('heading');
            titleEl.innerHTML = response;
        });
}
// DESCRIPTION
async function loadDescription() {
    let descriptionUrl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.description");
    let descriptionResults = fetchAndProcess(descriptionUrl)
        .then(response => {
            const descriptionEl = document.getElementById('description');
            descriptionEl.innerHTML = response;
        });
}
/************* Movie Inspiration Section ****************/

async function loadLocations() {
    let locationsUrl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.locations");
    // console.log(locationsUrl);
    let locationResults = fetchAndProcess(locationsUrl).then(response => {
        // console.log(response);
        const locationEL = document.getElementById('seriesLocations');
        response[0].map(
            function(location) {
                locationEL.innerHTML += `
               <li id="/images/${location.toString().replace(/\s|,/g, '')}.png">
                 ${location.toString()}
               </li>`;
            }
        );
    });
}

/************* SNIPPETS Section ****************/

async function loadSnippets() {
    let snippetsUrl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.snippets");
    let snippetsResults = fetchAndProcess(snippetsUrl).then(response => {
        const snippetsElement = document.getElementById('snippetsContent');
        snippetsElement.innerHTML = "";
        response[0].map(
            function(snippet) {
                snippetsElement.innerHTML += `
                   <p>"${snippet}"</p><br />
                `;
            }
        )
    });
}


/************* IMAGE GALLERY Section ****************/

async function loadImageGallery() {
    let galleryUrl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.gallery");
    let galleryResults = fetchAndProcess(galleryUrl).then(response => {

        const galleryElement = document.getElementById('galleryimg');
        galleryElement.innerHTML = "";
        response[0].map(
            function(gallery) {
                galleryElement.innerHTML += `
                      <img class="quote-shadow" src="${gallery.src}">
                      <p id="quoteAuthor" class="spacer-40">${gallery.text}</p>
               `
            }
        )
    });
}

/************* Author/Quote Section ****************/
async function author() {
    let quoteUrl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.quote");
    let quoteResults = fetchAndProcess(quoteUrl).then(response => {
        let quoteAuthor = document.getElementById('quoteAuthor').innerHTML = `\&mdash; ${response[0].author}`;
        let quote = document.getElementById('quoteContent').innerHTML = `${response[0].text}`;
    })
}

/************* Video Section ****************/

// TO DO: Figure out how to get over the CORS issue with localhost http vs https
async function videoPlayer() {
    let videoUrl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.videoembed");
    let videoResults = fetchAndProcess(videoUrl).then(response => {
        let videoLink = document.getElementById('videoContainer').innerHTML = `


          <button type="button" class="nes-btn is-normal" >
           <a href="${response[0]}" targe="_blank">Play video</a>
           </button>

           `;
    })
}


/************* Call Episodes Functions ****************/
async function episodesList() {
    let episodesUrl = createUrl("http://localhost:3000", "tt4574334", getLanguageSelect(), "$.episodelist");
    let episodesResults = fetchAndProcess(episodesUrl).then(

      response => {

        const episodesElement = document.getElementById('episodesTable');
        episodesElement.innerHTML = "";
        response[0].map(
            function(episodes) {
              // episodesElement.innerHTML += `
              //     <table class="nes-table is-bordered is-centered">
              //         <thead>
              //             <tr>
              //                 <th>Episode</th>
              //                 <th>Episode Title</th>
              //                 <th>Rating</th>
              //             </tr>
              //         </thead>
              //         <tbody>
              //             <tr>
              //                 <td>Chapter 1</td>
              //                 <td>The Vanishing of Will Byers</td>
              //                 <td id="episodeRating">8</td>
              //             </tr>
              //             <tr>
              //                 <td>Chapter 1</td>
              //                 <td>The Vanishing of Will Byers</td>
              //                 <td id="episodeRating">8</td>
              //             </tr>
              //             <tr>
              //                 <td>Chapter 1</td>
              //                 <td>The Vanishing of Will Byers</td>
              //                 <td id="episodeRating">8</td>
              //             </tr>
              //         </tbody>
              //     </table>



              // <div>${episodes[0]}</div>


              // `
            }
        )
    });
}

/************* Calling All Functions ****************/
async function reloadMovieContent() {
    loadHeading();
    loadDescription();
    loadLocations();
    loadSnippets();
    loadImageGallery();
    author();
    videoPlayer();
    episodesList();

}
// Populate the image map into the Did You Know .txt box
(function() {
    let seriesLocationList = document.getElementById('seriesLocations');
    seriesLocationList.onclick = function(event) {
        let target = event.target;
        let imageLocation = document.getElementById('locationImages');
        imageLocation.src = event.target.id;
    };
    reloadMovieContent();
})();