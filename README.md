# webworker-polyfill

Web worker has a lot of limitations like you cannot access `localStorage`, because you cannot access initiating window.

This library is to fill this gap, providing this missing objects. Only exception is that these APIs will become promised methods.

# Usage

Install:
`npm install webworker-polyfill`

In your host context:
```javascript
import polyfill from 'webworker-polyfill'

const worker = new Worker('./worker.js')
polyfill(worker)
```

In your worker context (`worker.js` here):
```javascript
import polyfill from 'webworker-polyfill'

polyfill(self)

// then do what you want to do
localStorage.setItem('set_from_worker', 'whatever')
localStorage.getItem('set_from_worker').then((value) => {
  console.log(value)
})

// or use ES2017 async/await
(async () => {
  const value = await localStorage.getItem('set_from_worker')
  console.log(value)
})()
```

# How it works

Just `postMessage()` and request the host context to access these resources whenever you access these missing APIs. Simple, right?

# Supported APIs

- localStorage
- indexDB
