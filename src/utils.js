// @ts-check

const HTML = require('node-html-parser');
const axios = require('axios').default;
const { _internal } = require('../config.json');

module.exports = {
  async getPage(endpoint, host = _internal.ytsHost) {
    const response = await axios.get(host + endpoint);
    return HTML.parse(response.data);
  },
};
