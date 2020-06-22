const imageIcon = 'file-image-outline';
const musicIcon = 'file-music-outline';
const wordIcon = 'microsoft-word';
const excelIcon = 'microsoft-excel';
const ppIcon = 'microsoft-powerpoint'
const pdfIcon = 'file-pdf-outline';
const othersIcon = 'text-box-outline';

const icons = new Map();
icons
  .set('jpeg', imageIcon)
  .set('jpg', imageIcon)
  .set('png', imageIcon)
  .set('bmp', imageIcon)
  .set('gif', imageIcon)
  .set('mp3', musicIcon)
  .set('wav', musicIcon)
  .set('wma', musicIcon)
  .set('docx', wordIcon)
  .set('doc', wordIcon)
  .set('xls', excelIcon)
  .set('xlsx', excelIcon)
  .set('ppt', ppIcon)
  .set('pptx', ppIcon)
  .set('pdf', pdfIcon)
  .set('others', othersIcon);

export default function getIcon(name) {
  let ext = name.substring(name.lastIndexOf('.') + 1);

  return name === ext || !icons.has(ext) ?
    icons.get('others') : icons.get(ext);
}