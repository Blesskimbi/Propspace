import { useState, useEffect } from 'react';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    listingType: ''
  });

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.listingType) params.append('listingType', filters.listingType);

      const { data } = await API.get(`/properties?${params.toString()}`);
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Find Your Dream Property 🏠</h1>
          <p style={styles.heroSubtitle}>
            Browse thousands of properties for rent and sale
          </p>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onSearch={fetchProperties}
          />

          {/* Properties Grid */}
          <div style={styles.main}>
            <h2 style={styles.sectionTitle}>
              All Properties{' '}
              <span style={styles.count}>({properties.length})</span>
            </h2>

            {/* Loading State */}
            {loading && (
              <div style={styles.center}>
                <p style={styles.loadingText}>⏳ Loading properties...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div style={styles.errorBox}>
                <p>{error}</p>
                <button onClick={fetchProperties} style={styles.retryBtn}>
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && properties.length === 0 && (
              <div style={styles.center}>
                <p style={styles.emptyText}>
                  🏚️ No properties found. Try adjusting your filters.
                </p>
              </div>
            )}

            {/* Properties Grid */}
            {!loading && !error && properties.length > 0 && (
              <div style={styles.grid}>
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  hero: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '60px 30px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '36px',
    marginBottom: '10px'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#aaa'
  },
  content: {
    display: 'flex',
    gap: '30px',
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  main: {
    flex: 1
  },
  sectionTitle: {
    color: '#1a1a2e',
    marginBottom: '20px'
  },
  count: {
    color: '#e94560',
    fontSize: '18px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  center: {
    textAlign: 'center',
    padding: '60px 0'
  },
  loadingText: {
    fontSize: '18px',
    color: '#666'
  },
  emptyText: {
    fontSize: '18px',
    color: '#666'
  },
  errorBox: {
    backgroundColor: '#ffe0e0',
    color: '#e94560',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center'
  },
  retryBtn: {
    marginTop: '10px',
    padding: '8px 20px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Home;