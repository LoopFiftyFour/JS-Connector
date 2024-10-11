const fs = require(`fs`);
const { version } = require(`./package.json`);

const argSyncVersions = process.argv[2] === `--sync`;

const coreFile = `./src/core.js`;


// The following regexes are required to keep all occurrences of the library's version number in sync.

// This regex is used for building the library in a local environment.
const placeholderRegex = /\d+\.\d+\.5454545454-build-number/;
// This regex is used during the TeamCity build pipeline which replaces the version placeholders before this library's build script is run.
const replacedVersionRegex = /\d+\.\d+\.\d+\b(?!-build-number)(?=.+## Version ##)/;


const coreText = fs.readFileSync(coreFile, `utf8`);

const matchLocal = coreText.match(placeholderRegex);
const matchTeamCity = coreText.match(replacedVersionRegex);


if (matchLocal) {
    console.log(`Local mode. Matched version:`, matchLocal[0]);

    if (argSyncVersions) {
        const replacedCore = coreText.replace(placeholderRegex, version);

        fs.writeFileSync(coreFile, replacedCore);

        console.log(`Versions synced:`, version);
        return;
    }

    verifyVersion(matchLocal[0]);
}
else if (matchTeamCity) {
    console.log(`Build pipeline mode. Matched version:`, matchTeamCity[0]);

    verifyVersion(matchTeamCity[0]);
}
else {
    throw Error(`Could not find version in ${coreFile}. Was looking for ${placeholderRegex.toString()} and ${replacedVersionRegex.toString()}`);
}

console.log(`Version successfully verified:`, version);


function verifyVersion(versionToVerify) {
    if (version !== versionToVerify) {
        throw Error(`Versions are out of sync. See README about version syncing.\npackage.json: ${version}\n${coreFile}: ${versionToVerify}`);
    }
}
