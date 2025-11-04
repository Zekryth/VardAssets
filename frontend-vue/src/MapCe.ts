import { defineCustomElement } from 'vue'
import MapView from './MapView.vue'
const El = defineCustomElement(MapView)
if (!customElements.get('vard-assets-map')) customElements.define('vard-assets-map', El)
export default El
