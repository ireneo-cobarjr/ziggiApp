import { LocalStorage as storage } from 'quasar'

export default (/* { app, router, Vue ... } */) => {
  if (storage.has('grant') && Date.now() >= storage.getItem('exp')) {
    console.log('expired')
    storage.remove('grant')
    storage.remove('exp')
  }
}
