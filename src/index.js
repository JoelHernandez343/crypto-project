import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import './css/index.css';
import './css/Animation.css';
import './css/tailwind.generated.css';
import './css/materialdesignicons.min.css';
import { loadSession } from './app/helpers/session';

/*global _node */

(async () => {
  await _node.initTmpDir();

  ReactDOM.render(
    <React.StrictMode>
      <App initialUser={await loadSession()} />
    </React.StrictMode>,
    document.getElementById('root')
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
