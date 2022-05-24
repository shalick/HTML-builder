const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const { Transform } = require("stream");

async function createDistDir() {
  let outputDirPath = path.resolve(__dirname, "project-dist");
  await fs.promises.rm(outputDirPath, { recursive: true, force: true });
  await fs.promises.mkdir(outputDirPath, { recursive: true });
}

const stylesDir = path.join(__dirname, "styles");
const distDir = path.join(__dirname, "project-dist");

async function createStylesBundle() {
  try {
    const files = await fsPromises.readdir(stylesDir, { withFileTypes: true });
    const bundleArr = [];

    for (const file of files) {
      const fileExt = path.extname(file.name).replace(/^\./, "");

      if (file.isFile() && fileExt == "css") {
        const filePath = path.join(stylesDir, file.name);
        const data = await fsPromises.readFile(filePath, "utf-8");
        bundleArr.push(data.trim());
      }
    }
    await fsPromises.writeFile(
      path.join(distDir, "style.css"),
      bundleArr.join("\n\n")
    );
  } catch (err) {
    console.error(err);
  }
}

async function getFileData(file) {
  let stream = fs.createReadStream(file);
  stream.setEncoding("utf8");
  let data = "";
  for await (const chunk of stream) {
    data += chunk;
  }
  return data;
}

const outputHTMLFilePath = path.resolve(__dirname, distDir, "index.html");
const templateFilePath = path.resolve(__dirname, "template.html");

async function generateHtml() {
  let outputStream = fs.createWriteStream(outputHTMLFilePath);
  let stream = fs.createReadStream(templateFilePath);
  const TransformTemplate = new Transform({
    async transform(chunk) {
      const regexp = /{{(.*)}}/g;
      const replacement = [...chunk.toString().matchAll(regexp)];

      const results = await Promise.all(
        replacement.reduce((acc, el) => {
          acc.push(
            (async (el) => {
              let html = await getFileData(
                path.resolve(__dirname, "components", el[1] + ".html")
              );
              return { placeholder: el[0], html: html };
            })(el)
          );
          return acc;
        }, [])
      );
      let html = chunk.toString();
      results.forEach((result) => {
        html = html.replace(result.placeholder, result.html);
      });
      this.push(html);
    },
  });

  stream.pipe(TransformTemplate).pipe(outputStream);
}

const assetsDir = path.resolve(__dirname, "assets");
const assetsDistDir = path.resolve(__dirname, distDir, "assets");

async function copyAssetsDir(assetsDistDir, assetsDir) {
  await fsPromises.mkdir(assetsDistDir, { recursive: true });
  const files = await fsPromises.readdir(assetsDir);

  files.forEach(async (file) => {
    const baseFile = path.join(assetsDir, file);
    const newFile = path.join(assetsDistDir, file);
    const stat = await fsPromises.stat(baseFile);
    if (stat.isDirectory()) {
      copyAssetsDir(newFile, baseFile);
    } else {
      await fsPromises.copyFile(baseFile, newFile);
    }
  });
}

async function build() {
  await createDistDir();
  createStylesBundle();
  generateHtml();
  copyAssetsDir(assetsDistDir, assetsDir);
}

build();
