

fs = require("fs");

let files = fs.readdirSync("./something/files").filter(
    str=> (/((.mp3)|(.flac)|(.wav)|(.ogg))$/).test(str)
);

let data = JSON.stringify({"files":files});

fs.writeFileSync("./something/files/files.js", "const file_names = " + data);