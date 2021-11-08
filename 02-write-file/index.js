const fs = require("fs");
const path = require('path');
const readline = require("readline");
// const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'));
let filePath = path.join(__dirname, 'destination.txt');

const writableStream = fs.createWriteStream(filePath);

writableStream.on("error", (error) => {
  console.log(
    `An error occured while writing to the file. Error: ${error.message}`
  );
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter a sentence: ",
});

rl.on("line", (line) => {
  switch (line.trim()) {
    case "exit":
      rl.close();
      break;
    default:
      rl.prompt();
      sentence = line + "\n";
      writableStream.write(sentence);
      break;
  }
}).on("close", () => {
  writableStream.end();
  writableStream.on("finish", () => {
    console.log(`All your sentences have been written to ${filePath}`);
  });
  setTimeout(() => {
    process.exit(0);
  }, 100);
});