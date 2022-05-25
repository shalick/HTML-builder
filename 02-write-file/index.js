const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { stdin, stdout } = process;
let filePath = path.join(__dirname, "destination.txt");

fs.writeFile(filePath, "", (err) => {
  if (err) throw err;
  stdout.write("Enter a sentence: \n");
  stdin.on("data", (data) => {
    if (data.toString().trim() === "exit") {
      exit();
    } else {
      fs.appendFile(filePath, data, (err) => {
        if (err) throw err;
      });
    }
  });
  process.on("SIGINT", process.exit);
  process.on("exit", () => {
    stdout.write(`All your sentences have been written to ${filePath}`);
    process.exit();
  });
});
