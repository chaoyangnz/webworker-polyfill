function uniqeid() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

const MESSAGE_CODE = 'W29&p0mfSii!,OSRAaiO#DeM'

// call code in host environment
function call(self, code) {
  return new Promise((resolve) => {
    const id = uniqeid()
    self._resolves.set(id, resolve)
    self.postMessage({
      magic: MESSAGE_CODE,
      code,
      id
    })
  })
}

function polyfillInHost(self) {
  self.addEventListener('message', (ev) => {
    if (ev.data.magic === MESSAGE_CODE) {
      self.postMessage({
        magic: MESSAGE_CODE,
        id: ev.data.id,
        return: eval(ev.data.code)
      })
    }
  })
}

function polyfillInWorker(self) {
  self._resolves = new Map()
  self.localStorage = {
    getItem(key) {
      return call(self, `localStorage.getItem('${key}')`)
    },
    setItem(key, value) {
      return call(self, `localStorage.setItem('${key}', '${value}')`)
    },
    removeItem(key) {
      return call(self, `localStorage.removeItem('${key}')`)
    }
  }
  self.addEventListener('message', (ev) => {
    if (ev.data.magic === MESSAGE_CODE) {
      const resolve = self._resolves.get(ev.data.id)
      resolve(ev.data.return)
    }
  })
}

export default function polyfill(self) {
  try {
    window
    polyfillInHost(self)
  } catch (ex) {
    polyfillInWorker(self)
  }
}
