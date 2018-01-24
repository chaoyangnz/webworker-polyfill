import polyfill from '../src/index'

polyfill(self)

const run = async () => {
    const value = await localStorage.getItem('key_in_localstorage')
    console.log(value)
}

run()
