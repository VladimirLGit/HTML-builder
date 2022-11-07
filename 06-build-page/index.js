const fs = require('fs');
const path = require('path');
const fsPromise = require('fs/promises');
let dirProject = path.resolve(__dirname + '/project-dist');
let assetsPriject = path.resolve(__dirname + '/project-dist/assets');
let htmlPath = path.resolve(__dirname + '/project-dist/index.html');
let cssPath = path.resolve(__dirname + '/project-dist/style.css');


fs.mkdir(dirProject, { recursive: true }, error => {
  if (error)
    throw error;
});

fs.mkdir(assetsPriject, { recursive: true }, error => {
  if (error)
    throw error;
});


fs.writeFile(
  htmlPath,
  '',
  (error) => {
    if (error)
      throw error;
  });

fs.writeFile(
  cssPath,
  '',
  (error) => {
    if (error)
      throw error;
  });

const deleteFile = (fileName) => {
  fs.unlink(fileName, (error => {
    if (error)
      console.log(error);
    else {
      console.log("Deleted file: " + fileName);
    }
  }));
}

async function copyFilesFromDirectory(sourceDirectory, destDirectory) {
  try {
    const copyFiles = await fsPromise.readdir(destDirectory, { withFileTypes: true });
    console.log(copyFiles);
    for (let copy of copyFiles) {
      deleteFile(`${destDirectory}/${copy.name}`);
    }

    const sourceFiles = await fsPromise.readdir(`${sourceDirectory}`, { withFileTypes: true });
    for (const file of sourceFiles) {
      if (file.isDirectory()) {
        fs.mkdir(`${destDirectory}/${file.name}`, { recursive: true }, error => {
          if(error)
            throw error; 
        });
        copyFilesFromDirectory(`${sourceDirectory}/${file.name}`, `${destDirectory}/${file.name}`);
      } 
      else
      if (file.isFile()) {
        fs.copyFile(`${sourceDirectory}/${file.name}`,
                    `${destDirectory}/${file.name}`,
                    (error) => {
                      if (error) {
                        console.log('Error Found:', error);
                      }
                    });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

copyFilesFromDirectory('06-build-page/assets', '06-build-page/project-dist/assets');

async function copyStyles(fileDirection) {
  try {
    let stylesComponents = await fsPromise.readdir(fileDirection, { withFileTypes: true });
    for (const styles of stylesComponents) {
      if (styles.isFile() === true && path.extname(styles.name) == '.css') {
        let css = await fsPromise.readFile(`${fileDirection}/${styles.name}`, 'utf-8');
        fs.appendFile(
          `${__dirname}/project-dist/style.css`,
          css,
          error => {
            if (error)
              throw error;
          });
      }
    }
  } catch (err) {
    console.log((err));
  }
}

copyStyles(`${__dirname}/styles`);

async function createHtml() {
  try {
    let templateHtml = await fsPromise.readFile(`${__dirname}/template.html`);
    let htmlComponents = await fsPromise.readdir(`${__dirname}/components`, { withFileTypes: true });
    let htmlTxt = templateHtml.toString();
    let currentPart = '';
    for (const component of htmlComponents) {
      if (component.isFile() && path.extname(component.name) === '.html') {
        currentPart = await fsPromise.readFile(`${__dirname}/components/${component.name}`);
        htmlTxt = htmlTxt.replace(`{{${component.name.slice(0, -5)}}}`, currentPart.toString());
      }
    }
    fsPromise.writeFile(`${__dirname}/project-dist/index.html`, htmlTxt);
  } catch (error) {
    console.log(error);
  }
}

createHtml();

