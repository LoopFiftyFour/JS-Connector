const packageFile = `./package.json`;
const coreFile = `./src/core.js`;


const fs = require(`fs`);
const { version } = require(packageFile);

const argSetBuildNumber = process.argv[2] === `--set-build-number`;
const argSyncVersions = process.argv[2] === `--sync`;
const argVerifyVersions = process.argv[2] === `--verify`;


// The build number is to be set by the TC build pipeline through string replacement.
const buildNumber = `TC-BUILD-NUMBER`;

// This regex is required to keep all occurrences of the library's version number in sync.
const placeholderRegex = /(\d+\.\d+\.)5454545454-build-number\b/;



const coreText = fs.readFileSync(coreFile, `utf8`);

const coreMatch = coreText.match(placeholderRegex);

if (!coreMatch) {
    throw Error(`Could not find version in ${coreFile}. Was looking for ${placeholderRegex.toString()}`);
}

const versionToVerify = coreMatch[0];

console.log(`Matched version:`, versionToVerify);



if (argSetBuildNumber) {
    const packageText = fs.readFileSync(packageFile, `utf8`);

    const replacedPackage = packageText.replace(placeholderRegex, `$1${buildNumber}`);
    const replacedCore = coreText.replace(placeholderRegex, `$1${buildNumber}`);

    fs.writeFileSync(packageFile, replacedPackage);
    fs.writeFileSync(coreFile, replacedCore);

    console.log(`Injected build number:`, buildNumber);
    return;
}

if (argSyncVersions) {
    const replacedCore = coreText.replace(placeholderRegex, version);

    fs.writeFileSync(coreFile, replacedCore);

    console.log(`Versions synced to:`, version);
    return;
}

if (argVerifyVersions) {
    if (version !== versionToVerify) {
        throw Error(`Versions are out of sync. See README about version syncing.\n${packageFile}: ${version}\n${coreFile}: ${versionToVerify}`);
    }

    console.log(`Version successfully verified.`);
    return;
}


console.log();
console.log(`WARNING: No parameter specified. Script did nothing. Check source for available parameters.`);
console.log();
