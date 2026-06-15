const FilterSidebar = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>🔍 Filter Properties</h3>

      <div style={styles.group}>
        <label style={styles.label}>City</label>
        <input
          type="text"
          name="city"
          placeholder="e.g. Yaounde"
          value={filters.city}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Min Price</label>
        <input
          type="number"
          name="minPrice"
          placeholder="e.g. 50000"
          value={filters.minPrice}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Max Price</label>
        <input
          type="number"
          name="maxPrice"
          placeholder="e.g. 500000"
          value={filters.maxPrice}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Property Type</label>
        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Studio">Studio</option>
        </select>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Listing Type</label>
        <select
          name="listingType"
          value={filters.listingType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">All</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
      </div>

      <button onClick={onSearch} style={styles.button}>
        Apply Filters
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '250px',
    height: 'fit-content'
  },
  title: {
    color: '#1a1a2e',
    marginBottom: '20px'
  },
  group: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    marginTop: '10px'
  }
};

export default FilterSidebar;