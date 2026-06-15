import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🏠 PropSpace</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Properties</Link>

        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>My Listings</Link>
            <Link to="/create-property" style={styles.link}>+ Add Property</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '22px',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px'
  },
  button: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px'
  }
};

export default Navbar;