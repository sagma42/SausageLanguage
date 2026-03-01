import React, { useState, useContext, useEffect } from 'react';
import { WordContext } from '../contexts/WordContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import { hashString } from '../utils/authUtils';
import { getAdminCreds, setAdminCreds, resetAdminCreds } from '../services/firebase';

function Admin() {
  const { addWord, words, removeWord, updateWord, addEkler, ekler, removeEkler, updateEkler } = useContext(WordContext);
  const [adminId, setAdminId] = useState('');
  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState(() => {
    return localStorage.getItem('adminLogged') === 'true';
  });
  const [setupMode, setSetupMode] = useState(false);
  const [tab, setTab] = useState('words'); // 'words' or 'ekler'

  useEffect(() => {
    // check firestore for credentials
    const load = async () => {
      const creds = await getAdminCreds();
      if (!creds) setSetupMode(true);
    };
    load();
  }, []);

  const [form, setForm] = useState({
    main: '',
    lang2: '',
    lang3: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [setupForm, setSetupForm] = useState({ id: '', password: '', confirm: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { id, password } = loginForm;
    const creds = await getAdminCreds();
    if (!creds) {
      setError('No admin configured');
      return;
    }
    if (id !== creds.id) {
      setError('Invalid id');
      return;
    }
    const hashed = await hashString(password);
    if (hashed !== creds.hash) {
      setError('Incorrect password');
      return;
    }
    localStorage.setItem('adminLogged', 'true');
    setIsLogged(true);
    navigate('/admin');
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    const { id, password, confirm } = setupForm;
    if (!id || !password) {
      setError('Both fields required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    const hash = await hashString(password);
    await setAdminCreds(id, hash);
    setSetupMode(false);
    setError('Admin created. Please log in.');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (tab === 'words') {
      if (editingId) {
        updateWord(editingId, form.main, form.lang2, form.lang3, form.description);
        setEditingId(null);
      } else {
        addWord(form.main, form.lang2, form.lang3, form.description);
      }
    } else {
      if (editingId) {
        updateEkler(editingId, form.main, form.lang2, form.lang3, form.description);
        setEditingId(null);
      } else {
        addEkler(form.main, form.lang2, form.lang3, form.description);
      }
    }
    setForm({ main: '', lang2: '', lang3: '', description: '' });
  };

  const handleEdit = (word) => {
    setForm({
      main: word.main,
      lang2: word.lang2,
      lang3: word.lang3,
      description: word.description,
    });
    setEditingId(word.id);
  };

  if (!isLogged) {
    if (setupMode) {
      return (
        <div className="admin-login">
          <h2>Setup Admin Account</h2>
          <form onSubmit={handleSetup} className="login-form">
            <input
              value={setupForm.id}
              onChange={(e) =>
                setSetupForm({ ...setupForm, id: e.target.value })
              }
              placeholder="admin id"
              required
            />
            <input
              type="password"
              value={setupForm.password}
              onChange={(e) =>
                setSetupForm({ ...setupForm, password: e.target.value })
              }
              placeholder="password"
              required
            />
            <input
              type="password"
              value={setupForm.confirm}
              onChange={(e) =>
                setSetupForm({ ...setupForm, confirm: e.target.value })
              }
              placeholder="confirm password"
              required
            />
            <button type="submit">Create admin</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      );
    }

    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            value={loginForm.id}
            onChange={(e) =>
              setLoginForm({ ...loginForm, id: e.target.value })
            }
            placeholder="id"
            required
          />
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            placeholder="password"
            required
          />
          <button type="submit">Log in</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  const handleReset = async () => {
    if (window.confirm('Delete admin credentials? You will need to re-setup.')) {
      await resetAdminCreds();
      setIsLogged(false);
      setSetupMode(true);
      navigate('/admin');
    }
  };

  return (
    <div className="admin-page">
      <div style={{ textAlign: 'right' }}>
      </div>
      <div className="admin-tabs">
        <button 
          className={tab === 'words' ? 'tab-active' : ''} 
          onClick={() => {
            setTab('words');
            setEditingId(null);
            setForm({ main: '', lang2: '', lang3: '', description: '' });
          }}
        >
          Words
        </button>
        <button 
          className={tab === 'ekler' ? 'tab-active' : ''} 
          onClick={() => {
            setTab('ekler');
            setEditingId(null);
            setForm({ main: '', lang2: '', lang3: '', description: '' });
          }}
        >
          Ekler
        </button>
      </div>
      <h2>{editingId ? `Edit ${tab === 'words' ? 'Word' : 'Ek'}` : `Add ${tab === 'words' ? 'Words' : 'Ekler'}`}</h2>
      <form onSubmit={handleAdd} className="word-form">
        <input
          placeholder="Main language"
          value={form.main}
          required
          onChange={(e) => setForm({ ...form, main: e.target.value })}
        />
        <input
          placeholder="Language 2"
          value={form.lang2}
          required
          onChange={(e) => setForm({ ...form, lang2: e.target.value })}
        />
        <input
          placeholder="Language 3"
          value={form.lang3}
          required
          onChange={(e) => setForm({ ...form, lang3: e.target.value })}
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">{editingId ? `Update ${tab === 'words' ? 'word' : 'ek'}` : `Add ${tab === 'words' ? 'word' : 'ek'}`}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ main: '', lang2: '', lang3: '', description: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* List for admin with edit and delete buttons */}
      <div className="admin-list">
        <h3>Existing {tab === 'words' ? 'words' : 'ekler'}</h3>
        {tab === 'words' && words.length === 0 && <p>No words yet.</p>}
        {tab === 'ekler' && ekler.length === 0 && <p>No ekler yet.</p>}
        {tab === 'words' && words.map((w) => (
          <div key={w.id} className="admin-word">
            <span>{w.main} / {w.lang2} / {w.lang3}</span>
            <div className="admin-actions">
              <button onClick={() => handleEdit(w)} className="edit-btn">Edit</button>
              <button onClick={() => removeWord(w.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
        {tab === 'ekler' && ekler.map((e) => (
          <div key={e.id} className="admin-word">
            <span>{e.main} / {e.lang2} / {e.lang3}</span>
            <div className="admin-actions">
              <button onClick={() => handleEdit(e)} className="edit-btn">Edit</button>
              <button onClick={() => removeEkler(e.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
