// For the loading of files that are not included in
// project's original json

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
            .map(function (word) { //split on anything that has spaces or special characters
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

/*
 * Code borrowd from https://stackoverflow.com/questions/38805134/search-key-in-nested-complex-json
 * Gets the type for the object (JSON Type)
 */
function type(object) {
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;

    if (object === null) {
        return "null";
    } else if (object === undefined) {
        return "undefined";
    } else if (object.constructor === stringConstructor) {
        return "String";
    } else if (object.constructor === arrayConstructor) {
        return "Array";
    } else if (object.constructor === objectConstructor) {
        return "Object";
    } else {
        return "null";
    }
}

/**
 * Code borrowd from https://stackoverflow.com/questions/38805134/search-key-in-nested-complex-json
 * Looks up an object by name in a JSON file
 * @param obj
 * @param k
 * @returns {([*, *]|null)|null|*[]}
 */
function lookup(obj, k) {
    for (key in obj) {

        value = obj[key];
        if (k == key) return [k, value];

        if (type(value) == "Object") {
            let y = lookup(value, k);
            if (y && y[0] == k) return y;
        }
        if (type(value) == "Array") {
            // for..in doesn't work the way you want on arrays in some browsers
            //
            for (let i = 0; i < value.length; ++i) {
                let x = lookup(value[i], k);
                if (x && x[0] == k) return x;
            }
        }
    }
    return null;
}

/**
 * A very simple template substitution implementation that looks for any elements in the loading HTML page
 * that have been tagged with an id attribute that ends with "AutoVal"
 * The value is then looked up in the sitemap object (JSON) and substitutes it if found
 * *** DOES NOT do any complex values and does not iterate for multiple values
 *
 * @param language target language
 * @param siteMap the JSON file that contains the strings that we want to substitute
 * @returns {Promise<void>} A promise for the text to substitute
 */
async function loadFromMap(language, siteMap) {
    const allElements = document.getElementsByTagName("*"); // all elements from loading page
    for (let element of allElements) {
        let id = element.getAttribute("id"); // get the id
        if ((id != null) && id.endsWith("AutoVal")) { // if it is a magic id (id="*AutoVal") then find it in the sitemap
            let siteMapEl = lookup(siteMap, id); // get the element in the sitemap configuration // see if the sitemap has it
            if (siteMapEl) { // if we get something from the nap
                let words = siteMapEl[1]; // HACK / Research - not sure why this was returned as an array
                const translatedText = translate(language, words); // translate if needed
                element.innerHTML = translatedText; // then substitute it
            }
        }
    }
}

async function loadNavigation(language, siteMap) {
    const mainNavigationElement = document.getElementById('mainNavigation');
    mainNavigationElement.innerHTML = "";
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
}

async function reloadSiteMapLanguage() {
    let url = "http://localhost:3000/data/sitemap.json";
    await fetchContent(url).then(response => {
        const language = getLanguageSelect();
        loadNavigation(language, response);
        loadFromMap(language, response);
    });
}

(async function () {
    await reloadSiteMapLanguage();

})().catch(e => {
    console.log(e)
});


