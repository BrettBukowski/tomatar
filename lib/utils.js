'use strict';

module.exports = {
  writeJSON: writeJSON
};

/**
 * Writes JSON in the response.
 * @param  {Object} response ServerResponse instance
 * @param  {Object|String} content  Results or String error message
 * @param  {Number=} type     HTTP status code; defaults to 200
 */
function writeJSON (response, content, type) {
  response.writeHead(type || 200, { 'Content-Type': 'application/json' });

  if (typeof content == 'string') {
    content = { error: content };
  }
  else {
    content = { result: content };
  }
  content.success = !!!type;

  response.end(JSON.stringify(content));
}
