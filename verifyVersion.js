const fs = require(`fs`);
const { version } = require(`./package.json`);

const argSyncVersions = process.argv[2] === `--sync`;

const coreFile = `./src/core.js`;


// This regex is required to keep all occurrences of the library's version number in sync.
const placeholderRegex = /\d+\.\d+\.5454545454-build-number\b/;


const coreText = fs.readFileSync(coreFile, `utf8`);

const match = coreText.match(placeholderRegex);

if (!match) {
    throw Error(`Could not find version in ${coreFile}. Was looking for ${placeholderRegex.toString()}`);
}

const versionToVerify = match[0];

console.log(`Matched version:`, versionToVerify);


if (argSyncVersions) {
    const replacedCore = coreText.replace(placeholderRegex, version);

    fs.writeFileSync(coreFile, replacedCore);

    console.log(`Versions synced to:`, version);
    return;
}

if (version !== versionToVerify) {
    throw Error(`Versions are out of sync. See README about version syncing.\npackage.json: ${version}\n${coreFile}: ${versionToVerify}`);
}


console.log(`Version successfully verified.`);
