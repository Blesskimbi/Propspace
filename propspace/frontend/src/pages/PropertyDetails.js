import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get(`/properties/${id}`);
      setProperty(data);
    } catch (err) {
      setError('Property not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      setDeleting(true);
      await API.delete(`/properties/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = user && property && 
    property.author._id === user._id;

  return (
    <>
      <Navbar />
      <div style={styles.container}>

        {/* Loading State */}
        {loading && (
          <div style={styles.center}>
            <p style={styles.loadingText}>⏳ Loading property...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={styles.errorBox}>
            <p>{error}</p>
            <Link to="/" style={styles.backLink}>← Back to Listings</Link>
          </div>
        )}

        {/* Property Details */}
        {!loading && !error && property && (
          <div style={styles.card}>
            {/* Image */}
            <img
              src={property.imageUrls[0] || 
                'https://via.placeholder.com/800x400'}
              alt={property.title}
              style={styles.image}
            />

            <div style={styles.body}>
              {/* Badges */}
              <div style={styles.badges}>
                <span style={styles.badge}>{property.propertyType}</span>
                <span style={styles.listingBadge}>{property.listingType}</span>
              </div>

              {/* Title & Price */}
              <h1 style={styles.title}>{property.title}</h1>
              <p style={styles.price}>
                💰 XAF {property.price.toLocaleString()}
              </p>
              <p style={styles.location}>
                📍 {property.city}, {property.country}
              </p>

              {/* Description */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={styles.description}>{property.description}</p>
              </div>

              {/* Author Info */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Listed By</h3>
                <div style={styles.author}>
                  <img
                    src={property.author.avatar || 
                      'https://via.placeholder.com/50'}
                    alt={property.author.username}
                    style={styles.avatar}
                  />
                  <div>
                    <p style={styles.authorName}>
                      {property.author.username}
                    </p>
                    <p style={styles.authorEmail}>
                      {property.author.email}
                    </p>
                    {property.author.phone && (
                      <p style={styles.authorPhone}>
                        📞 {property.author.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div style={styles.actions}>
                  <Link
                    to={`/edit-property/${property._id}`}
                    style={styles.editBtn}
                  >
                    ✏️ Edit Property
                  </Link>
                  <button
                    onClick={handleDelete}
                    style={styles.deleteBtn}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : '🗑️ Delete Property'}
                  </button>
                </div>
              )}

              {/* Back Link */}
              <Link to="/" style={styles.backLink}>
                ← Back to Listings
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '30px'
  },
  center: {
    textAlign: 'center',
    padding: '60px 0'
  },
  loadingText: {
    fontSize: '18px',
    color: '#666'
  },
  errorBox: {
    backgroundColor: '#ffe0e0',
    color: '#e94560',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover'
  },
  body: {
    padding: '30px'
  },
  badges: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  badge: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '13px'
  },
  listingBadge: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '13px'
  },
  title: {
    color: '#1a1a2e',
    fontSize: '28px',
    marginBottom: '10px'
  },
  price: {
    color: '#e94560',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  location: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '20px'
  },
  section: {
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    marginTop: '20px'
  },
  sectionTitle: {
    color: '#1a1a2e',
    marginBottom: '10px'
  },
  description: {
    color: '#444',
    lineHeight: '1.7',
    fontSize: '15px'
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  authorName: {
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: '0 0 3px'
  },
  authorEmail: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 3px'
  },
  authorPhone: {
    color: '#666',
    fontSize: '14px',
    margin: 0
  },
  actions: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px',
    borderTop: '1px solid #eee',
    paddingTop: '20px'
  },
  editBtn: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '15px'
  },
  deleteBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px'
  },
  backLink: {
    display: 'inline-block',
    marginTop: '20px',
    color: '#e94560',
    textDecoration: 'none',
    fontSize: '15px'
  }
};

export default PropertyDetails;