const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const stylesDir = path.join(__dirname, "styles");
const distDir = path.join(__dirname, "project-dist");

async function mergeStyles() {
    try {
        const files = await fsPromises.readdir(stylesDir, { withFileTypes: true });
        const bundleArr = [];
    
        for (const file of files) {
          const fileExt = path.extname(file.name).replace(/^\./, '');
    
          if (file.isFile() && fileExt == 'css') {
            const filePath = path.join(stylesDir, file.name);
            const data = await fsPromises.readFile(filePath, 'utf-8');
            bundleArr.push(data.trim());
          }
        }
        await fsPromises.writeFile(path.join(distDir, 'bundle.css'), bundleArr.join('\n\n'));
        console.log('All styles are in the bundle');
      } catch (err) {
        console.error(err);
      }
}

mergeStyles();
