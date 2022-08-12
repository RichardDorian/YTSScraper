const { getPage } = require('./utils');

async function scrapSubtitle(host, endpoint) {
  const page = await getPage(endpoint, host);

  return `${host}${page
    .querySelector(
      'body > div:nth-child(4) > div:nth-child(2) > div.col-md-5.col-md-pull-4.col-sm-8.movie-main-info.text-center > div.row > div:nth-child(4) > a'
    )
    ?.getAttribute('href')}`;
}

module.exports = {
  async scrapMovieSubtitles(url) {
    const parsedUrl = new URL(url);
    const host = `${parsedUrl.protocol}//${parsedUrl.host}`;

    const page = await getPage('', url);
    const table = page.querySelectorAll(
      'body > div:nth-child(4) > div:nth-child(5) > div > table > tbody > *'
    );

    const languages = {};

    for (let i = 0; i < table.length; i++) {
      const nodes = page.querySelectorAll(
        `body > div:nth-child(4) > div:nth-child(5) > div > table > tbody > tr:nth-child(${
          i + 1
        }) > *`
      );

      const score = nodes[0].childNodes[0].innerText;
      const language = nodes[1].childNodes[1].innerText;
      const endpoint = nodes[2].childNodes[1].getAttribute('href');

      if (!languages[language] || languages.score >= score) {
        languages[language] = {
          language,
          url: await scrapSubtitle(host, endpoint),
        };
      }
    }

    return Object.values(languages);
  },
};
