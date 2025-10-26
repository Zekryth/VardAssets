<template>
  <div ref="root" class="map-root"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, defineProps, defineEmits } from 'vue'
import * as L from 'leaflet'

const props = defineProps<{
  tileSize?: number
  cols?: number
  rows?: number
  offsetX?: number
  offsetY?: number
  isAdmin?: boolean
  tileBaseUrl?: string
  refreshKey?: number
}>()

const emit = defineEmits(['map-ready','tile-clicked','map-error'])

const root = ref<HTMLDivElement|null>(null)
let map: any = null
let gridLayer: any = null
let ro: ResizeObserver | null = null

const MISS = new Map<string, number>()
const MISS_TTL = 5 * 60 * 1000

function init() {
  const ts = props.tileSize ?? 256
  const cols = Number(props.cols ?? 1)
  const rows = Number(props.rows ?? 1)
  const offX = Number(props.offsetX ?? 0)
  const offY = Number(props.offsetY ?? 0)
  const W = cols * ts, H = rows * ts

  map = L.map(root.value!, {
    crs: (L as any).CRS.Simple,
    minZoom: -2, maxZoom: 2, inertia: true, zoomControl: false, attributionControl: false
  })

  // bounds ajustados al bloque actual
  const sw: [number, number] = [0, H]
  const ne: [number, number] = [W, 0]
  const bounds = L.latLngBounds(map.unproject(sw as any, 0), map.unproject(ne as any, 0))
  map.setMaxBounds(bounds.pad(0.1))
  map.fitBounds(bounds)

  type GL = ReturnType<typeof L.gridLayer> & { createTile: (c:any)=>HTMLDivElement }
  gridLayer = L.gridLayer({ tileSize: ts, className: 'grid-layer' }) as GL
  gridLayer.createTile = (c:any) => {
    const el = L.DomUtil.create('div') as HTMLDivElement
    el.style.cssText = `width:${ts}px;height:${ts}px;box-sizing:border-box;border-right:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.12);background:#fff;`
    const base = (props.tileBaseUrl || '/tiles/0')
    const rk = props.refreshKey ?? 0
    const wx = c.x - offX
    const wy = c.y - offY
    const key = `${wx}_${wy}`

    const last = MISS.get(key) || 0
    if (Date.now() - last < MISS_TTL) return el

    const setImg = (u:string) => { el.style.backgroundImage = `url("${u}")`; el.style.backgroundSize = 'cover' }
    const tryJpg = () => {
      const j = new Image()
      j.onload = () => setImg(`${base}/${key}.jpg?rk=${rk}`)
      j.onerror = () => MISS.set(key, Date.now())
      j.src = `${base}/${key}.jpg?rk=${rk}`
    }
    const p = new Image()
    p.onload = () => setImg(`${base}/${key}.png?rk=${rk}`)
    p.onerror = tryJpg
    p.src = `${base}/${key}.png?rk=${rk}`

    return el
  }
  gridLayer.addTo(map)

  if (props.isAdmin) {
    map.on('click', (e:any) => {
      const pt = map.project(e.latlng, 0)
      const gx = Math.floor(pt.x / ts)
      const gy = Math.floor(pt.y / ts)
      const wx = gx - offX
      const wy = gy - offY
      emit('tile-clicked', { x: wx, y: wy })
    })
  }

  setTimeout(()=>{ try { map.invalidateSize() } catch {} },0)
  ro = new ResizeObserver(()=>{ try { map.invalidateSize() } catch {} })
  ro.observe(root.value!)
  emit('map-ready')
}

onMounted(() => {
  if (!root.value) return
  init()
})

onBeforeUnmount(() => { try { map?.remove() } catch {}; map=null; ro?.disconnect(); ro=null })

watch(() => [props.cols, props.rows], () => {
  // Re-crear mapa si cambian dimensiones del bloque
  try { map?.remove() } catch {}
  map = null; gridLayer = null; ro?.disconnect(); ro = null
  if (root.value) init()
})
watch(() => props.refreshKey, () => { try { gridLayer?.redraw() } catch {} })
</script>

<style src="leaflet/dist/leaflet.css"></style>
<style scoped>
:host { display:block; position:relative; width:100%; height:100% }
.map-root { position:absolute; inset:0; background:var(--color-bg-base,#000) }
.map-root :deep(.leaflet-container){ position:absolute; inset:0; width:100%; height:100%; background:var(--color-bg-surface,#fff) !important }
</style>