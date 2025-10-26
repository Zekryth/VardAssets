// Fallback opcional si el editor aún marca rojo (no afecta build)
declare module 'leaflet' {
  const L: any
  export = L
  export default L
}