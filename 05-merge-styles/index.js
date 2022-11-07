const fs = require('fs');
const path = require('path');
let fileDirection = path.resolve(__dirname + '/project-dist/bundle.css');

fs.writeFile(fileDirection,
             '',
             (error) => {
               if (error) 
                 throw error;
             });

fs.readdir('05-merge-styles/styles',
           {withFileTypes: true},
           callBack());


function callBack() {
  return function (error, files) {
    let res = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].isFile() === true && path.extname(files[i].name) == '.css') {
        fs.readFile(`05-merge-styles/styles/${files[i].name}`,
          'utf-8',
          (error, data) => {
            res.push(data);
            fs.appendFile(fileDirection,
                          data,
                          error => {
                            if (error)
                              throw error;
                          });
          });
      }
    }
  };
}

