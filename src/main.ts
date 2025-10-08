import './style.css'
import { setupCanvas } from './canvas'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas" width="800" height="600" class="m-0"></canvas>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!)