'use strict';

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

_bluebird2.default.promisifyAll(fs);

var host = 'http://localhost:9200';
var endPoint = 'products/tour';
var rl = _readline2.default.createInterface({
  input: fs.createReadStream('products.text')
});

rl.on('line', function (line) {
  var parsed = JSON.parse(line);
  _requestPromise2.default.put({
    method: 'PUT',
    uri: host + '/' + endPoint + '/' + parsed.product_id,
    body: line
  }).then(function (body) {
    console.log(body);
  });
});