import axios from 'axios'
import { inc, dec } from '../components/System/progressStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  inc()
  return config
}, (error) => { return Promise.reject(error) })

api.interceptors.response.use((response) => {
  dec()
  return response
}, (error) => {
  dec()
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verifyToken: () => api.get('/auth/verify'),
}

export const userService = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
}

export const companyService = {
  getCompanies: (config = {}) => api.get('/companies', config),
  createCompany: (companyData) => api.post('/companies', companyData),
  updateCompany: (id, data) => api.patch(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
}

export const objectService = {
  getObjects: (params = {}) => api.get('/objects', { params }),
  createObject: (formData) => api.post('/objects', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateObject: (id, data) => api.patch(`/objects/${id}`, data),
  deleteObject: (id) => api.delete(`/objects/${id}`),
}

export const pointService = {
  getPoints: (params = {}) => api.get('/points', { params }),
  createPoint: (pointData) => api.post('/points', pointData),
  updatePoint: (id, data) => api.patch(`/points/${id}`, data),
  // Accept optional meta payload: { reason, context }
  deletePoint: (id, meta) => api.delete(`/points/${id}`, meta ? { data: meta } : undefined),
  uploadFiles: (id, files) => {
    const fd = new FormData()
    for (const f of files?.fotos || []) fd.append('fotos', f)
    for (const d of files?.documentos || []) fd.append('documentos', d)
    return api.post(`/points/${id}/files`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}

export const deletedPointsService = {
  list: () => api.get('/points/deleted/list'),
  restore: (id) => api.post(`/points/deleted/${id}/restore`),
  purge: (id) => api.delete(`/points/deleted/${id}`),
}

export const fileService = {
  deleteFile: (pointId, fileIndex, meta) =>
    api.delete(`/points/${pointId}/files/${fileIndex}`, { data: meta })
// Deleted files logic removed. Reverting to previous state.
}

export const tileService = {
  upload: (x, y, file, z = 0) => {
    const fd = new FormData()
    fd.append('x', String(x))
    fd.append('y', String(y))
    fd.append('z', String(z))
    fd.append('file', file)
    return api.post('/map/tiles', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  delete: (x, y, z = 0) => api.delete('/map/tiles', { params: { x, y, z } }),
  exists: (x, y, z = 0) => api.head('/map/tiles', { params: { x, y, z } }),
  list: (z = 0) => api.get('/map/tiles/list', { params: { z } }).then(r => r.data)
}

export default api