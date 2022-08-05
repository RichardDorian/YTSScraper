// @ts-check

const axios = require('axios').default;
const { config, _internal } = require('../config.json');
const HTML = require('node-html-parser');
const { createWriteStream } = require('node:fs');

const stream = createWriteStream(config.output);
let movieCount = 0;

async function scrapMovie(url) {
  const endpoint = url.replace(_internal.ytsHost, '');
  const page = await getPage(endpoint);

  const title = page.querySelector('#movie-info>div>h1')?.innerText;
  if (!title) return;

  const downloads = [...page.querySelectorAll('[rel=nofollow]')].filter(
    (e) => e.classList.length === 0
  );

  let downloadUrl;
  let quality;
  for (const resolution of config.downloadPriority) {
    for (const download of downloads) {
      if (download.innerText.includes(resolution)) {
        downloadUrl = download.getAttribute('href');
        quality = resolution;
        break;
      }
    }
    if (downloadUrl) break;
  }

  if (!downloadUrl)
    return console.warn(`Can't get download url for movie ${title}`);

  console.log(`Movie scraped ${title} (count=${movieCount})`);

  movieCount++;
  saveMovie({
    title,
    downloadUrl,
    quality,
  });
}

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

async function getPage(endpoint) {
  const response = await axios.get(_internal.ytsHost + endpoint);
  return HTML.parse(response.data);
}

stream.write('[');
let first = true;
async function saveMovie(movie) {
  stream.write((first ? '' : ',') + '\n  ' + JSON.stringify(movie));
  first = false;
}

async function quit() {
  stream.write('\n]');
  stream.end();
  console.log(
    `\n\nScraper exited (lastPageScraped=${currentPage}, moviesScraped=${movieCount})`
  );
  process.exit(0);
}

console.log(`Scraper started (endpoint=${_internal.browse})...`);
scrapPage();

process.on('SIGINT', quit);
