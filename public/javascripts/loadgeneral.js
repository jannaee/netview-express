// For the loading of files that are not included in
// project's original json

function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

async function fetchContent(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

/*
  A pig latin translator taken pretty directly from:
   https://github.com/jombastic/pig-latin/tree/master/js
*/
function translate(language, words) {
  if (language == 'en_US') {
    return words; // assumes english is being passed in //return english data set
  } else if (language != 'la_PG') {
    throw "Translation error: Asked to translate an unimplemented language =" + language + "=";
  } else { // Translate into pig latin
    let result = words.split(/\s|\b/)
      .map(function(word) { //split on anything that has spaces or special characters
        word = word.toLowerCase();
        let n = word.search(/[aeiuo]/); //return the poistion of the first vowel
        let ans = "";
        if (n === 0) { //for words that start with a vowel
          ans = word + "yay";
        } else if (n === -1) { //does not have a vowel
          ans = word;
        } else { //for words that do not start with a vowel and does not have a vowel.
          ans = word.substr(n) + word.substr(0, 1) + word.substring(1, n) + "ay";
        }
        //    console.log("ans="+ans);
        return ans;
      });
    // should replace punctuation with a regexp that squeezes out the spaces but this takes care of most of the
    // ugly ones displayed
    let s = result.join(" ").replace(" ,", ",")
     .replace(" .", ".").replace(". ", ".");
    return s;
  }
}

function getLanguageSelect() {
  let languageSelector = document.getElementById('language_select');
  let selectedIndex = languageSelector.selectedIndex;
  let selectedLanguage = languageSelector[selectedIndex].value;
  return selectedLanguage;
}

async function loadTitle(language, siteMap) {
  const translatedText = translate(language, siteMap.hero.title);
  const titleEl = document.getElementById('heroTitle');
  titleEl.innerHTML = translatedText;
}

async function loadNavigation(language, siteMap) {
  const mainNavigationElement = document.getElementById('mainNavigation');
  mainNavigationElement.innerHTML = "";
  // console.log("mainNavigationElement" + mainNavigationElement);
  // console.log("mainNavigationElement" + JSON.stringify(mainNavigationElement));
  siteMap.hero.mainNavigation.map(
    function (navText) {
      mainNavigationElement.innerHTML += `
               <li id="#${navText.toString()}">
               	<a href="#${navText.toString().toLowerCase()}-panel">
${translate(language, navText.toString())}
</a>
               </li>`;
    }
  );
  // console.log("mainNavigationElement2" + JSON.stringify(mainNavigationElement));

}

async function reloadSiteMapLanguage() {
  let url = "http://localhost:3000/data/sitemap.json";
  await fetchContent(url).then(response => {
    const language = getLanguageSelect();
    loadTitle(language, response);
    loadNavigation(language, response);
// TODO: REFACTOR INTO FUNCTIONS
	// INSPIRATION
	const translatedInspirationTitle = translate(language, response.inspiration.title);
			const inspirationTitle = document.getElementById('inspirationHeader');
				inspirationTitle.innerHTML = translatedInspirationTitle ;

	const translatedInspirationSubhead = translate(language, response.inspiration.subheading);
			const inspirationSubhead = document.getElementById('translateSubhead');
				inspirationSubhead.innerHTML = translatedInspirationSubhead;

	const translateDidYouKnow = translate(language, response.inspiration.description);
		const inspirationDidYouKnow = document.getElementById('movieFacts');
				inspirationDidYouKnow.innerHTML = translateDidYouKnow;
	// GALLERY
	const translatedGalleryTitle = translate(language, response.gallerypanel.title);
		const galleryTitle = document.getElementById("galleryHeader");
				galleryTitle.innerHTML = translatedGalleryTitle;
	// EPISODES
	const translatedEpisodesTitle = translate(language, response.episodespanel.title);
		const episodesTitle = document.getElementById("episodesHeader");
			episodesTitle.innerHTML = translatedEpisodesTitle;

  });
}

(async function() {
  await reloadSiteMapLanguage();

})().catch(e => {console.log(e)});


