/**
 * progressStore.js
 *
 * Módulo simple para gestionar el estado de progreso global (cargas, operaciones en curso).
 * Permite incrementar, decrementar y suscribirse a cambios en el contador de operaciones activas.
 */
let listeners = new Set()
let active = 0

export function inc() {
  active++
  emit()
}
export function dec() {
  active = Math.max(0, active-1)
  emit()
}
export function getActive() { return active }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) }
function emit(){ listeners.forEach(fn => fn(active)) }
