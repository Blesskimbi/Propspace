import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div style={styles.card}>
      <img
        src={property.imageUrls[0] || 'https://via.placeholder.com/300x200'}
        alt={property.title}
        style={styles.image}
      />
      <div style={styles.body}>
        <span style={styles.badge}>{property.propertyType}</span>
        <span style={styles.listingBadge}>{property.listingType}</span>
        <h3 style={styles.title}>{property.title}</h3>
        <p style={styles.location}>📍 {property.city}, {property.country}</p>
        <p style={styles.price}>💰 XAF {property.price.toLocaleString()}</p>
        <Link to={`/properties/${property._id}`} style={styles.button}>
          View Details
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  body: {
    padding: '15px'
  },
  badge: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    marginRight: '5px'
  },
  listingBadge: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px'
  },
  title: {
    margin: '10px 0 5px',
    fontSize: '16px',
    color: '#1a1a2e'
  },
  location: {
    color: '#666',
    fontSize: '14px',
    margin: '5px 0'
  },
  price: {
    color: '#e94560',
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '5px 0'
  },
  button: {
    display: 'inline-block',
    marginTop: '10px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '14px'
  }
};

export default PropertyCard;