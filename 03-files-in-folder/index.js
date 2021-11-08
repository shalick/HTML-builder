const fs = require("fs");
const path = require("path");
const folderPath = path.resolve(__dirname, "./secret-folder");

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  console.log("\nsecret-folder directory files:");
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (file.isFile()) {
        fs.stat(`${folderPath}/${file.name}`, (err, stats) => {
          if (err) throw err;
          console.log(`${path.parse(file.name).name} - ${path.extname(file.name).replace(/^\./, '')} - ${stats.size}b`);
        });
      }
    });
  }
});
