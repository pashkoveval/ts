import { render } from './render.js'
import localStorage from './localStorage.js'

localStorage();

window.addEventListener('DOMContentLoaded', () => {
  render()
})
