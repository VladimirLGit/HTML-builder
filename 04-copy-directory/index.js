
const fs = require('fs');
const path = require('path');
const way = path.resolve('04-copy-directory', 'files-copy');
const fsPromise = require('fs/promises');

fs.mkdir(way, { recursive: true }, error => {
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

async function copyFilesFromDirectory() {
  try {
    const copyFiles = await fsPromise.readdir('04-copy-directory/files-copy', { withFileTypes: true });
    console.log(copyFiles);
    for (let copy of copyFiles) {
      deleteFile(`04-copy-directory/files-copy/${copy.name}`);
    }

    const sourceFiles = await fsPromise.readdir('04-copy-directory/files', { withFileTypes: true });
    for (const file of sourceFiles) {
      if (file.isFile()) {
        fs.copyFile(`04-copy-directory/files/${file.name}`,
                    `04-copy-directory/files-copy/${file.name}`,
                    (error) => {
          if (error) {
            console.log('Error Found:', error);
          }
        });
      }
    }
  } catch (error) {
    console.log((error));
  }
}

copyFilesFromDirectory();
