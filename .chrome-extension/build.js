import fs from 'fs';

const materialsDirPath = '.chrome-extension/materials';
const distDirPath = 'dist';

function build() {
  if (!fs.existsSync(distDirPath)) {
    console.error('Dist directory does not exists!');
  }

  fs.cp(materialsDirPath, distDirPath, { recursive: true }, (err) => {
    err && console.error(err);
  });
}

build();