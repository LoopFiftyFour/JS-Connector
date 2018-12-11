const runAll = require("npm-run-all");

const runopts = {parallel: true, stdout: process.stdout};

console.log("Running bundle");
runAll(["bundle"], runopts)
    .then(() => {console.log("Running watch"); runAll(["watch"], runopts)})
    .then(() => {console.log("Running server"); runAll(["server"], runopts)})
    .then(() => console.log("server done!"))
    .catch(console.error);

