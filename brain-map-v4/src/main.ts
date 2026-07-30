import './ui/app';

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./service-worker.js');
  });
}
