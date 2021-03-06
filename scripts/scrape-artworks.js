const readline = require('readline');
const CONSTANTS = require('../config/constants');
const ArtworkScraper = require('../lib/artwork-scraper');

// number of artwork listings per page, as of 7/16/18, there are 128 artwork pages at http://sanjoseca.gov/Facilities
const NUM_ARTWORKS_TO_SCRAPE = 300;
// Debug mode skips terminal prompt; necessary if running the program through IDE .
const DEBUG_MODE = true;

(function main() {
  let readlineInterface;

  new Promise((resolve, reject) => {
    console.log(`Debug mode is: ${DEBUG_MODE ? 'on' : 'off'}`);
    if (DEBUG_MODE) {
      return resolve();
    }

    readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readlineInterface.question(
      `This action will overwrite the two files \n\n${CONSTANTS.PATH_ARTWORKS_SCRAPED} \n${
        CONSTANTS.PATH_ARTWORKS_ERRORS
      } \n\nif it exists. Are you sure you want to continue?\n`,
      answer => {
        answer = answer.toLowerCase();
        if (answer === 'yes' || answer === 'y') {
          return resolve();
        }
        reject();
      }
    );
  })
    .then(() => {
      return new ArtworkScraper({
        numArtworksToScrape: NUM_ARTWORKS_TO_SCRAPE,
        startID: 169
      }).run();
    })
    .catch(err => {
      console.error('Aborted.');
      console.error(err);
    })
    .then(() => {
      if (readlineInterface) {
        readlineInterface.close();
      }
    });
})();
