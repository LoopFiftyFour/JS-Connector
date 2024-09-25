const { version } = require(`./package.json`);

const chunks = [];


process.stdin.on(`data`, input => {
    chunks.push(input.toString());
});

process.stdin.on(`end`, () => {
    const replaced = chunks.join(``).replaceAll(`___REPLACED DURING BUILD JOB___`, version);

    console.log(replaced);
});
