# YTS Scraper

Scrap torrent urls from YTS (https://yts.torrentbay.to/)

# How to ?

## Requirements

- Install NodeJS (LTS is recommended)
- An internet connection (what do you want to do without one anyway)
- Some disk space (the size depends on how long you run the script)

## Clone the repository

```bash
$ git clone https://github.com/RichardDorian/ytsscraper.git
```

## Edit the config

Open `config.json` and edit it to fit your needs, the default settings are fine though.

By default the scraper will scrap all the movies on the "Browse Movies" page but if you want to scrap all "4K" movies you can set the `browse` value to

```
/browse-movies/0/2160p/all/0/latest/0/all
```

As of writing this special browse page only contains a bit less than 1,000 movies and can be fully scraped in less than 15 minutes.

## Start the scraper

```bash
$ npm start
```

By default the scrapper will exit when the page its scrapping is empty but you can manually exit by pressing <kbd>Ctrl</kbd> + <kbd>C</kbd> while being in your terminal

## Update

If I update this repository for some reason 🤷

```bash
$ npm run update
```

# Disclaimer

Use this at your own risk, I don't care what you do with this and I am not responsible if you illegaly download movies with that.

This script won't download any torrent! It will only create a file with the movie name and its torrent download url.
Here is an example:

```json
{
  "title": "Joker",
  "downloadUrl": "https://yts.torrentbay.to/torrent/download/**********************************",
  "quality": "2160p"
}
```

# Is this program well coded?

No, I wrote this in 30 minutes because I was bored
