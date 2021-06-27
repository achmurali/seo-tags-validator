const colors = require('colors');

const log = {
    warning:(str) => {
        console.log(colors.yellow(str))
    },
    info:(str) => {
        console.log(str)
    },
    error:(str) => {
        console.log(colors.red(str))
    }
};

module.exports = {
    log
};