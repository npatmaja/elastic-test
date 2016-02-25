import * as fs from 'fs';
import Promise from 'bluebird';
import readline from 'readline';
import request from 'request-promise';

Promise.promisifyAll(fs);

const host = 'http://localhost:9200';
const endPoint = 'products/tour';
const rl = readline.createInterface({
  input: fs.createReadStream('products.text')
});


rl.on('line', line => {
  let parsed = JSON.parse(line);
  request.put({
    method: 'PUT',
    uri: `${host}/${endPoint}/${parsed.product_id}`,
    body: line
  })
  .then(body => {
    console.log(body)
  });
});
