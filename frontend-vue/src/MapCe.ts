import { defineCustomElement } from 'vue'
import MapView from './MapView.vue'
const El = defineCustomElement(MapView)
if (!customElements.get('mapshade-map')) customElements.define('mapshade-map', El)
export default El
