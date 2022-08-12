// @ts-check

let first = true;
let movieCount = 0;
let stream = null;

module.exports = {
  setStream(_stream) {
    stream = _stream;
  },
  async saveMovie(movie) {
    stream?.write((first ? '' : ',') + '\n  ' + JSON.stringify(movie));
    first = false;
    movieCount++;
  },
  getMovieCount: () => movieCount,
};
