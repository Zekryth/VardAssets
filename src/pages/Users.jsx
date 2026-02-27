/**
 * Users.jsx
 *
 * User management page, accessible only to administrators.
 * Create, edit, delete users and change their roles (user/admin) from the interface.
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export default function Users() {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'usuario', password: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
    }
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setUsers(await userService.list());
    setLoading(false);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (editId) {
        await userService.update(editId, form);
        setSuccess('User updated');
      } else {
        await userService.create(form);
        setSuccess('User created');
      }
      setForm({ nombre: '', email: '', rol: 'usuario', password: '' });
      setEditId(null);
      loadUsers();
    } catch (e) {
      setError('Error saving user');
    }
  };

  const handleEdit = u => {
    setForm({ nombre: u.nombre, email: u.email, rol: u.rol, password: '' });
    setEditId(u.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    await userService.remove(id);
    loadUsers();
  };

  const handleRole = async (id, rol) => {
    if (!window.confirm('Change this user\'s role?')) return;
    await userService.update(id, { rol });
    loadUsers();
  };

  if (!isAdmin()) {
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        Access denied. Only administrators can manage users.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">Here administrators can create, edit, delete users and change their permissions.</p>

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded shadow">
        <div className="flex flex-wrap gap-3 mb-2">
          <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Name" className="px-3 py-2 rounded border w-48" />
          <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="px-3 py-2 rounded border w-48" />
          <select name="rol" value={form.rol} onChange={handleChange} className="px-3 py-2 rounded border">
            <option value="usuario">User</option>
            <option value="admin">Admin</option>
          </select>
          <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="px-3 py-2 rounded border w-48" />
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded" type="submit">
          {editId ? 'Update' : 'Create'}
        </button>
        {editId && (
          <button type="button" className="ml-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditId(null); setForm({ nombre: '', email: '', rol: 'usuario', password: '' }); }}>
            Cancel
          </button>
        )}
      </form>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {success && <div className="mb-2 text-green-600">{success}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4">No users found.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-3 py-2">{u.nombre}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">
                  <select value={u.rol} onChange={e => handleRole(u.id, e.target.value)} className="px-2 py-1 rounded border">
                    <option value="usuario">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2" onClick={() => handleEdit(u)}>Edit</button>
                  {u.id !== user?.id && (
                    <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(u.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
