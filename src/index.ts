import DiagramFrame from './components/DiagramFrame.vue'
import SeqDiagram from './components/SeqDiagram.vue'

import './assets/tailwind.css'
import './components/Cosmetic.scss'
import './components/Cosmetic-blue.scss'
import './components/Cosmetic-black-white.scss'
import './components/theme-blue-river.scss'
import './assets/themes/handwriting.css';

import Store from './store/Store'

// @ts-ignore
const Version = VERSION || ''
// @ts-ignore
const BuildTime = BUILD_TIME || ''
const VueSequence = {
  Version,
  BuildTime,
  Store,
  SeqDiagram,
  DiagramFrame
}
export { VueSequence }
