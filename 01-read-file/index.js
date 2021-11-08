const fs = require('fs');
const path = require('path');
const { stdout } = process;

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), {highWaterMark: 16});
const data = [];

readStream.on('data', (chunk) => {
    data.push(chunk);
});

readStream.on('end', () => {
    stdout.write(Buffer.concat(data).toString() + "\n");
})

readStream.on('error', (err) => {
    console.log('error :', err)
})

// console.log(__dirname);

// console.log(__filename);