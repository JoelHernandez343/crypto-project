const { src, dest } = require('gulp');

const copy_materialicon_font = () =>
  src('node_modules/@mdi/font/fonts/**/*').pipe(dest('src/fonts'));

const copy_materialicon_css = () =>
  src('node_modules/@mdi/font/css/materialdesignicons.min.css').pipe(
    dest('src/css')
  );

exports.copy_tasks = [copy_materialicon_font, copy_materialicon_css];
