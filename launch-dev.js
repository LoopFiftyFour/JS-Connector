const runAll = require("npm-run-all");
const forever = require("forever");

console.log("Starting dev environment");

const runopts = {parallel: true, stdout: process.stdout};

runAll(["bundle"], runopts)
    .then(() => runAll(["watch"], runopts))
    .then(() => runAll(["server"], runopts))
    .then(() => console.log("server done!"))
    .catch(console.error);

