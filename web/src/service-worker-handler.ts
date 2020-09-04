import {logs} from 'named-logs-console';
import {updateAvailable} from './stores/appUpdates';

const log = logs('sw.js');
function updateLoggingForWorker(worker) {
  if (worker) {
    worker.postMessage({type: 'debug', level: log.level, enabled: log.enabled});
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    const swLocation = `${typeof window.basepath === 'undefined' ? '/' : window.basepath}sw.js`;
    navigator.serviceWorker.register(swLocation).then((registration) => {
      updateLoggingForWorker(registration.installing);
      updateLoggingForWorker(registration.waiting);
      updateLoggingForWorker(registration.active);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[Service Worker] Update found');
            updateAvailable.set(true);
          }
        });
      });
    });
  });
}
