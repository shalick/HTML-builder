const fs = require("fs");
// const fsPromises = require("fs").promises;
const fsPromises = fs.promises;
const path = require("path");
const filesPath = path.resolve(__dirname, "./files");
const filesCopyPath = path.resolve(__dirname, "./files-copy");

async function copyDir() {
  await fs.access(filesCopyPath, (err) => {
    if (err) {
      fsPromises
        .mkdir(filesCopyPath)
        .then(function () {
          console.log("Directory created successfully");
        })
        .catch(function () {
          console.log("failed to create directory");
        });
    } else {
      console.log("files-copy already exists");
    }
  });

  await fs.readdir(filesPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile()) {
          fsPromises
            .copyFile(
              `${filesPath}/${file.name}`,
              `${filesCopyPath}/${file.name}`
            )
            .then(function () {
              console.log(`${file.name} File Copied`);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    }
  });
}

copyDir();
