import WebWorker from 'worker-loader?name=example.work.js&publicPath=dist/!./worker.js'
import polyfill from '../src/index';

localStorage.setItem('key_in_localstorage', 'in localstorage')

window.onload = () => {
  const worker = new WebWorker()

  polyfill(worker)
}

