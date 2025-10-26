// userService.js
// Servicio simulado para la gestión CRUD de usuarios en el frontend (listado, creación, edición, eliminación, cambio de roles).
// Servicio simulado para gestión de usuarios
const usersDB = [
  { id: 1, nombre: 'Administratod', email: 'admin@VarddAssets.com', rol: 'admin' },
  { id: 2, nombre: 'User 1', email: 'user@VarddAssets.com', rol: 'user1' }
];

export const userService = {
  list: async () => {
    await new Promise(r => setTimeout(r, 300));
    return [...usersDB];
  },
  create: async (user) => {
    await new Promise(r => setTimeout(r, 300));
    const id = usersDB.length ? Math.max(...usersDB.map(u => u.id)) + 1 : 1;
    const newUser = { ...user, id };
    usersDB.push(newUser);
    return newUser;
  },
  update: async (id, data) => {
    await new Promise(r => setTimeout(r, 300));
    const idx = usersDB.findIndex(u => u.id === id);
    if (idx !== -1) usersDB[idx] = { ...usersDB[idx], ...data };
    return usersDB[idx];
  },
  remove: async (id) => {
    await new Promise(r => setTimeout(r, 300));
    const idx = usersDB.findIndex(u => u.id === id);
    if (idx !== -1) usersDB.splice(idx, 1);
    return true;
  }
};
