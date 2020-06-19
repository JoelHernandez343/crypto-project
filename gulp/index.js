const { series } = require('gulp');
const { compile_tailwindcss } = require('./_tailwindcss');
const { copy_tasks } = require('./_assets');

exports.default = series(...copy_tasks, compile_tailwindcss);