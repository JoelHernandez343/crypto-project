const { src, dest } = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');

const compile_tailwindcss = () =>
  src('assets/tailwind.css')
    .pipe(postcss([tailwindcss]))
    .pipe(rename(path => (path.extname = '.generated.css')))
    .pipe(dest('src/css'));

exports.compile_tailwindcss = compile_tailwindcss;
