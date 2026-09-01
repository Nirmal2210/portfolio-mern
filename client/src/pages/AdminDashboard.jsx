import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

const emptyProject = {
  title: '',
  year: '',
  role: '',
  type: 'particles',
  color: 'c8ff00',
  large: false,
  order: 0,
  link: '',
};

function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/projects').then((res) => setProjects(res.data));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
      } else {
        await api.post('/projects', form);
      }
      setForm(emptyProject);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      year: p.year,
      role: p.role,
      type: p.type,
      color: p.color,
      large: p.large,
      order: p.order,
      link: p.link || '',
    });
    setEditingId(p._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
        <input name="role" placeholder="Role / category" value={form.role} onChange={handleChange} required className="full" />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="particles">particles</option>
          <option value="grid">grid</option>
          <option value="wave">wave</option>
          <option value="noise">noise</option>
          <option value="scan">scan</option>
        </select>
        <input name="color" placeholder="Color hex (no #), e.g. c8ff00" value={form.color} onChange={handleChange} />
        <input name="order" type="number" placeholder="Order" value={form.order} onChange={handleChange} />
        <input name="link" placeholder="External link (optional)" value={form.link} onChange={handleChange} />
        <label>
          <input type="checkbox" name="large" checked={form.large} onChange={handleChange} />
          Large card (spans 2 columns)
        </label>
        <button type="submit">{editingId ? 'Update Project' : 'Add Project'}</button>
        {editingId && (
          <button
            type="button"
            style={{ background: 'transparent', color: 'var(--fg)', border: '1px solid var(--dim)', cursor: 'pointer' }}
            onClick={() => { setForm(emptyProject); setEditingId(null); }}
          >
            Cancel edit
          </button>
        )}
        {error && <div className="form-status err full">{error}</div>}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th><th>Title</th><th>Year</th><th>Type</th><th>Large</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p.order}</td>
              <td>{p.title}</td>
              <td>{p.year}</td>
              <td>{p.type}</td>
              <td>{p.large ? 'yes' : 'no'}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState([]);

  const load = () => {
    api.get('/messages').then((res) => setMessages(res.data));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    await api.patch(`/messages/${id}/read`);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/messages/${id}`);
    load();
  };

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Date</th><th>Name</th><th>Email</th><th>Message</th><th>Read</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((m) => (
          <tr key={m._id}>
            <td>{new Date(m.createdAt).toLocaleString()}</td>
            <td>{m.name}</td>
            <td>{m.email}</td>
            <td style={{ maxWidth: 300 }}>{m.message}</td>
            <td>{m.read ? 'yes' : 'no'}</td>
            <td>
              {!m.read && <button onClick={() => markRead(m._id)}>Mark read</button>}
              <button onClick={() => remove(m._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('projects');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) navigate('/admin/login');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/">View site</Link>
          <button onClick={logout} style={{ cursor: 'pointer' }}>Log out</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>Projects</button>
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>Messages</button>
      </div>

      {tab === 'projects' ? <ProjectsTab /> : <MessagesTab />}
    </div>
  );
}
