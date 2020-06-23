const image = 'file-image-outline';
const music = 'file-music-outline';
const word = 'microsoft-word';
const excel = 'microsoft-excel';
const pp = 'microsoft-powerpoint';
const pdf = 'file-pdf-outline';
const others = 'text-box-outline';
const consoleIcon = 'console';
const font = 'format-letter-case-upper';
const zip = 'folder-zip-outline';
const code = 'code-json';

const icons = new Map()
  .set('jpeg', image)
  .set('png', image)
  .set('jpg', image)
  .set('bmp', image)
  .set('gif', image)
  .set('mp3', music)
  .set('wav', music)
  .set('wma', music)
  .set('docx', word)
  .set('doc', word)
  .set('xls', excel)
  .set('xlsx', excel)
  .set('ppt', pp)
  .set('pptx', pp)
  .set('pdf', pdf)
  .set('sh', consoleIcon)
  .set('ttf', font)
  .set('otf', font)
  .set('zip', zip)
  .set('rar', zip)
  .set('gz', zip)
  .set('js', code)
  .set('css', code)
  .set('html', code)
  .set('c', code)
  .set('cpp', code)
  .set('vhd', code)
  .set('others', others);

export { icons };
