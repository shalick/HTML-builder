const fs = require("fs");
// const fsPromises = require("fs").promises;
const fsPromises = fs.promises;
const path = require("path");
const filesPath = path.resolve(__dirname, "./files");
const filesCopyPath = path.resolve(__dirname, "./files-copy");

async function copyDir() {
  await fs.mkdir(filesCopyPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  
  await fs.readdir(filesCopyPath, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(filesCopyPath, file), (err) => {
        if (err) throw err;
      });
    });
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
