// @ts-check

const { config, _internal } = require('../config.json');
const { createWriteStream } = require('node:fs');
const { scrapMovie } = require('./movie');
const { getPage } = require('./utils');
const { getMovieCount, setStream } = require('./save');

const stream = createWriteStream(config.output);
setStream(stream);

let currentPage = config.startAtPage;
async function scrapPage() {
  const parameter = currentPage === 1 ? '' : `?page=${currentPage}`;
  const page = await getPage(_internal.browse + parameter);

  const movies = [...page.querySelectorAll('.browse-movie-title')].map((e) =>
    e.getAttribute('href')
  );

  if (movies.length === 0) {
    console.log('\nNo more movies to download, exiting...');
    quit();
  }
  for (const movie of movies) {
    await scrapMovie(movie);
  }

  currentPage++;
  await scrapPage();
}

stream.write('[');

async function quit() {
  stream.write('\n]');
  stream.end();
  console.log(
    `\n\nScraper exited (lastPageScraped=${currentPage}, moviesScraped=${getMovieCount()})`
  );
  process.exit(0);
}

console.log(`Scraper started (endpoint=${_internal.browse})...`);
scrapPage();

process.on('SIGINT', quit);
