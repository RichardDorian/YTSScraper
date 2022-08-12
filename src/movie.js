// @ts-check

const { config, _internal } = require('../config.json');
const { saveMovie, getMovieCount } = require('./save');
const { scrapMovieSubtitles } = require('./subtitle');
const { getPage } = require('./utils');

module.exports = {
  async scrapMovie(url) {
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

    let subtitles = {};
    const subtitlesUrl = page
      .querySelector(
        '#movie-info > div.bottom-info > p.hidden-md.hidden-lg > a.button'
      )
      ?.getAttribute('href');
    if (subtitlesUrl) subtitles = await scrapMovieSubtitles(subtitlesUrl);

    console.log(`Movie scraped ${title} (count=${getMovieCount()})`);

    saveMovie({
      title,
      downloadUrl,
      quality,
      subtitles,
    });
  },
};
