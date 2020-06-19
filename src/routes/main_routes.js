import UploadSection from '../components/sections/UploadSection';
import DownloadSection from '../components/sections/DownloadSection';
import AboutSection from '../components/sections/AboutSection';

const mainRoutes = [
  {
    section: 'upload',
    navInfo: {
      title: "Subir archivos",
      icon: "cloud-upload-outline"
    },
    route: UploadSection
  },
  {
    section: 'download',
    navInfo: {
      title: "Descargar archivos",
      icon: "download-lock-outline"
    },
    route: DownloadSection
  },
  {
    section: 'about',
    navInfo: {
      title: "Sobre",
      icon: "account-supervisor-circle",
    },
    route: AboutSection
  },
];

export default mainRoutes;