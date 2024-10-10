const runAll = require("npm-run-all");

const runopts = {
    parallel : true,
    stdout   : process.stdout,
    stderr   : process.stderr,
};

console.log("Running clean");
runAll(["clean"], runopts)
    .then(() => {
        console.log("Running build");
        return runAll(["build-*"], runopts);
    })
    .then(() => {
        console.log("Running uglify");
        return runAll(["uglify"], runopts)
    });
