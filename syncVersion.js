const fs = require(`fs`);
const { version } = require(`./package.json`);

const coreFile = `./src/core.js`;


const replacedCore = fs
    .readFileSync(coreFile, `utf8`)
    .replaceAll(/\d+\.\d+\.5454545454-build-number/g, version);

fs.writeFileSync(coreFile, replacedCore);
