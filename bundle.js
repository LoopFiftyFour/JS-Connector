const runAll = require("npm-run-all");

const runopts = {
    parallel : true,
    stdout   : process.stdout,
};

console.log("Running clean");
runAll(["clean"], runopts)
    .then(() => {
        console.log("Running build");
        runAll(["build-*"], runopts)
            .then(() => {
                console.log("Running uglify");
                runAll(["uglify"], runopts)
            })
    })
    .catch(console.error);
