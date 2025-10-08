import './style.css'
import { setupCanvas } from './canvas'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas" width="800" height="600"></canvas>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!)