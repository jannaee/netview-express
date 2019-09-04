const express = require('express');
const router = express.Router();
const fs = require('fs');
const jsonpath = require('jsonpath');
const fetch = require('node-fetch');
/* Get data  - retrieves the data as a service with the URL formatted as shown below
*  Example: http://localhost:3000/shows/tt4574334/lang/en_US/jsPath/$.episodelist[*].simplename
*  Note the inner function is marked as async
* */
router.get('/:showId/lang/:langId/jsPath/:objectPath',  async function (req, res, next) {
    // prepare data for the API call
    const urlPrefix = "http://localhost:3000/data/"; // should parameterize
    const language = req.params.langId;
    const movieId = req.params.showId;
    const objectPath = req.params.objectPath;
    // make call and pretty print the resulting JSON
    let json =  await getSelectContent(urlPrefix, language, movieId, objectPath);
    let prettyPrintedJSONString = JSON.stringify(json, null, 4);
    // return the HTTP response
    res.header("Content-Type", 'application/json');
    res.send(prettyPrintedJSONString);
});
/*
  Get language specific content from the IMDB files
  urlPrefix - http:// + base url prefix
  language = the i18n language-locale of the content
  movieId = the IMDB move id (tt4574334 for Stranger Things)
  objectPath = the path to the content in the file see:
       https://www.npmjs.com/package/jsonpath
       https://jsonpath.com/ - nice online form for testing the expression
  return - an JSON object of the data at the given location
*/
async function getSelectContent(urlPrefix, language, movieId, objectPath) {
    const fileName = movieId + "/" + language + ".json";
    const filePath = urlPrefix + fileName;
    const fetchResult = fetch(filePath);
    const response = await fetchResult;
    let jsonData = await response.json();
    cleanupDataForPresentation(jsonData);
    return await jsonpath.query(jsonData, objectPath);
}
/* a collection of hacks to make the data nicer to work with
* I would typically ask the server side developer to do these
* but typically the data would be easier to work with I believe
* #1 creates object "videoembed" from "video-embed" so the JSON path library can access
* #2 creates object "episodelist" from "episode-list" so the JSON path library can access
* #3 removes "Chapter: "
*/
function cleanupDataForPresentation(jsonData) {
// HACK - json path library does not deal well with "-" in the key names
    // #1 making copies of data without the keys
    jsonData.videoembed = jsonData["video-embed"];
    jsonData.episodelist = jsonData["episode-list"];
    // HACK - changing chapter names
    jsonData.episodelist.map((episode, position) => {
        if ((episode.name) && (episode.name.toString().indexOf(":") != -1)) {
            episode.simplename = episode.name.slice(episode.name.toString().indexOf(":") + 2, episode.name.length);
        }
    });
}
module.exports = router;