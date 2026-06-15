import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) return setError('Please fill in all fields');
    try {
      setLoading(true);
      const { data } = await API.post('/auth/login', formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div style={S.page}>
        {/* Left panel */}
        <div style={S.left}>
          <div style={S.leftOverlay} />
          <div style={S.leftContent}>
            <h2 style={S.leftTitle}>
              Find the <em style={S.italic}>Right Property,</em><br />for Your Next Move
            </h2>
            <p style={S.leftSub}>Browse thousands of listings across Cameroon, updated daily.</p>
          </div>
        </div>

        {/* Right form */}
        <div style={S.right}>
          <div style={S.formWrap}>
            <p style={S.eyebrow}>Welcome Back</p>
            <h2 style={S.formTitle}>Sign in to PropSpace</h2>
            <p style={S.formSub}>Enter your credentials to access your account</p>

            {error && (
              <div style={S.errorAlert}>
                <AlertCircle size={15} strokeWidth={2} />
                {error}
              </div>
            )}

            <form style={S.form} onSubmit={handleSubmit}>
              <div style={S.field}>
                <label style={S.label}>Email address</label>
                <div style={S.inputWrap}>
                  <Mail size={15} color="#C8956C" strokeWidth={1.8} style={S.inputIcon} />
                  <input type="email" name="email" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange} style={S.input} autoComplete="email" />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Password</label>
                <div style={S.inputWrap}>
                  <Lock size={15} color="#C8956C" strokeWidth={1.8} style={S.inputIcon} />
                  <input type="password" name="password" placeholder="Enter your password"
                    value={formData.password} onChange={handleChange} style={S.input} autoComplete="current-password" />
                </div>
              </div>

              <button type="submit" style={S.submitBtn} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p style={S.footer}>
              Don't have an account? <Link to="/register" style={S.footerLink}>Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const S = {
  page: { minHeight: 'calc(100vh - 60px)', display: 'flex' },
  left: {
    flex: 1, position: 'relative',
    background: 'linear-gradient(160deg, #2C3E50 0%, #1a252f 100%)',
    display: 'flex', alignItems: 'flex-end', padding: '52px',
    overflow: 'hidden',
  },
  leftOverlay: {
    position: 'absolute', inset: 0,
    backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=70")',
    backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18,
  },
  leftContent: { position: 'relative', color: '#fff' },
  leftTitle: {
    fontSize: '34px', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  italic: { fontStyle: 'italic' },
  leftSub: { fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 },
  right: {
    width: '460px', flexShrink: 0,
    backgroundColor: '#faf9f7',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 40px',
  },
  formWrap: { width: '100%', maxWidth: '360px' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C8956C', marginBottom: '10px' },
  formTitle: { fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '6px' },
  formSub: { fontSize: '14px', color: '#888', marginBottom: '28px' },
  errorAlert: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#fff8f5', border: '1px solid #f0d0c0', color: '#c0392b',
    padding: '10px 14px', borderRadius: '4px', fontSize: '13.5px', marginBottom: '18px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#1a1a1a' },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '1px solid #e4e0db', borderRadius: '4px',
    backgroundColor: '#fff', overflow: 'hidden',
  },
  inputIcon: { padding: '0 12px', flexShrink: 0 },
  input: { flex: 1, padding: '11px 12px 11px 0', border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent' },
  submitBtn: {
    padding: '13px', backgroundColor: '#C8956C', color: '#fff',
    border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 700,
    cursor: 'pointer', marginTop: '6px',
  },
  footer: { textAlign: 'center', marginTop: '22px', fontSize: '14px', color: '#888' },
  footerLink: { color: '#C8956C', fontWeight: 700, textDecoration: 'none' },
};

export default Login;
