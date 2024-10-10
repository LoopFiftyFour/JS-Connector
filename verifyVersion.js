const fs = require(`fs`);
const { version } = require(`./package.json`);

const argSyncVersions = process.argv[2] === `--sync`;

const coreFile = `./src/core.js`;
const placeholderRegex = /\d+\.\d+\.5454545454-build-number/;


const coreText = fs.readFileSync(coreFile, `utf8`);

const match = coreText.match(placeholderRegex);

if (match === null) {
    throw Error(`Could not find version placeholder in ${coreFile}. Was looking for ${placeholderRegex.toString()}`);
}


if (argSyncVersions) {
    const replacedCore = coreText.replace(placeholderRegex, version);

    fs.writeFileSync(coreFile, replacedCore);

    console.log(`Versions synced:`, version);
    return;
}


if (version !== match[0]) {
    throw Error(`Versions are out of sync. See README about version syncing.\npackage.json: ${version}\n${coreFile}: ${match[0]}`);
}

console.log(`Version successfully verified:`, version);
