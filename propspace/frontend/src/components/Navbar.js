import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusSquare, User, LogOut, ChevronDown, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (p) => location.pathname === p;

  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        {/* Logo */}
        <Link to="/" style={S.logo}>
          <span style={S.logoMark}>P</span>
          <span style={S.logoText}>rop<strong>Space</strong></span>
        </Link>

        {/* Links */}
        <div style={S.links}>
          <Link to="/" style={{ ...S.link, ...(isActive('/') ? S.linkActive : {}) }}>
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{ ...S.link, ...(isActive('/dashboard') ? S.linkActive : {}) }}>
                My Listings
              </Link>
              <Link to="/create-property" style={{ ...S.link, ...(isActive('/create-property') ? S.linkActive : {}) }}>
                Add Property
              </Link>

              {/* Avatar menu */}
              <div style={S.userWrap}>
                <button style={S.avatarBtn} onClick={() => setMenuOpen(!menuOpen)}>
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=C8956C&color=fff&size=32`}
                    alt={user.username}
                    style={S.avatarImg}
                  />
                  <span style={S.avatarName}>{user.username}</span>
                  <ChevronDown size={14} color="rgba(255,255,255,0.6)" />
                </button>

                {menuOpen && (
                  <div style={S.dropdown}>
                    <Link to="/dashboard" style={S.dropItem} onClick={() => setMenuOpen(false)}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/create-property" style={S.dropItem} onClick={() => setMenuOpen(false)}>
                      <PlusSquare size={15} /> New Listing
                    </Link>
                    <Link to="/profile" style={S.dropItem} onClick={() => setMenuOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    <div style={S.dropDivider} />
                    <button style={S.dropItemDanger} onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={S.link}>Sign In</Link>
              <Link to="/register" style={S.contactBtn}>Contact Us →</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const S = {
  nav: {
    backgroundColor: '#2C3E50',
    position: 'sticky',
    top: 0,
    zIndex: 200,
  },
  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 32px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  logoMark: {
    width: '30px',
    height: '30px',
    backgroundColor: '#C8956C',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '16px',
    flexShrink: 0,
    lineHeight: '30px',
    textAlign: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 300,
    letterSpacing: '0.2px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  link: {
    color: 'rgba(255,255,255,0.80)',
    fontSize: '13.5px',
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: '4px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  linkActive: {
    color: '#ffffff',
    borderBottom: '2px solid #C8956C',
  },
  contactBtn: {
    marginLeft: '8px',
    padding: '8px 20px',
    backgroundColor: '#C8956C',
    color: '#fff',
    fontSize: '13.5px',
    fontWeight: 600,
    borderRadius: '4px',
    textDecoration: 'none',
    letterSpacing: '0.2px',
  },
  userWrap: {
    position: 'relative',
    marginLeft: '8px',
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '4px',
    padding: '5px 12px 5px 6px',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '13.5px',
    fontWeight: 500,
  },
  avatarImg: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '13px',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #e4e0db',
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    minWidth: '195px',
    overflow: 'hidden',
    zIndex: 300,
  },
  dropItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 16px',
    fontSize: '14px',
    color: '#2C3E50',
    textDecoration: 'none',
    transition: 'background 0.15s',
    cursor: 'pointer',
  },
  dropDivider: {
    height: '1px',
    backgroundColor: '#f0ece8',
    margin: '3px 0',
  },
  dropItemDanger: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    textAlign: 'left',
    padding: '11px 16px',
    fontSize: '14px',
    color: '#c0392b',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Navbar;
