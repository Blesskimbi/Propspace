import { MapPin, Building2, Tag, DollarSign, X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleClear = () => setFilters({ city: '', minPrice: '', maxPrice: '', propertyType: '', listingType: '' });
  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <aside style={S.sidebar}>
      <div style={S.header}>
        <h3 style={S.title}>Filters</h3>
        {hasFilters && (
          <button onClick={handleClear} style={S.clearBtn}>
            <X size={13} strokeWidth={2.5} /> Clear
          </button>
        )}
      </div>

      {/* Listing Type */}
      <div style={S.section}>
        <label style={S.label}><Tag size={12} strokeWidth={2} /> Listing Type</label>
        <div style={S.toggleRow}>
          {[['', 'All'], ['rent', 'For Rent'], ['sale', 'For Sale']].map(([v, l]) => (
            <button
              key={v}
              style={{ ...S.toggle, ...(filters.listingType === v ? S.toggleActive : {}) }}
              onClick={() => setFilters({ ...filters, listingType: v })}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div style={S.section}>
        <label style={S.label}><Building2 size={12} strokeWidth={2} /> Property Type</label>
        <div style={S.toggleRow}>
          {[['', 'All'], ['Apartment', 'Apt'], ['House', 'House'], ['Studio', 'Studio']].map(([v, l]) => (
            <button
              key={v}
              style={{ ...S.toggle, ...(filters.propertyType === v ? S.toggleActive : {}) }}
              onClick={() => setFilters({ ...filters, propertyType: v })}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* City */}
      <div style={S.section}>
        <label style={S.label}><MapPin size={12} strokeWidth={2} /> City</label>
        <div style={S.inputWrap}>
          <input
            type="text" name="city"
            placeholder="e.g. Yaoundé"
            value={filters.city}
            onChange={handleChange}
            style={S.input}
          />
        </div>
      </div>

      {/* Price */}
      <div style={S.section}>
        <label style={S.label}><DollarSign size={12} strokeWidth={2} /> Price Range (XAF)</label>
        <div style={S.priceRow}>
          <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} style={S.priceInput} />
          <span style={S.priceSep}>—</span>
          <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} style={S.priceInput} />
        </div>
      </div>

      <button onClick={onSearch} style={S.applyBtn}>Search Properties</button>
    </aside>
  );
};

const S = {
  sidebar: {
    backgroundColor: '#fff', border: '1px solid #e4e0db',
    borderRadius: '6px', padding: '20px',
    width: '240px', flexShrink: 0,
    height: 'fit-content', position: 'sticky', top: '72px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  title: { fontSize: '15px', fontWeight: 700, color: '#1a1a1a' },
  clearBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    background: 'none', border: 'none', color: '#C8956C',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0,
  },
  section: { marginBottom: '18px' },
  label: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '11px', fontWeight: 700, color: '#999',
    textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px',
  },
  toggleRow: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
  toggle: {
    padding: '4px 11px', borderRadius: '3px',
    border: '1px solid #e4e0db', backgroundColor: '#f5f5f5',
    color: '#666', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
  },
  toggleActive: { backgroundColor: '#2C3E50', borderColor: '#2C3E50', color: '#fff' },
  inputWrap: { border: '1px solid #e4e0db', borderRadius: '4px', overflow: 'hidden' },
  input: { width: '100%', padding: '8px 10px', border: 'none', outline: 'none', fontSize: '13px', color: '#1a1a1a', backgroundColor: '#fff' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  priceInput: {
    flex: 1, padding: '8px 8px', border: '1px solid #e4e0db', borderRadius: '4px',
    fontSize: '13px', color: '#1a1a1a', outline: 'none', backgroundColor: '#fff',
  },
  priceSep: { color: '#bbb', fontSize: '14px', flexShrink: 0 },
  applyBtn: {
    width: '100%', padding: '10px', marginTop: '4px',
    backgroundColor: '#C8956C', color: '#fff',
    border: 'none', borderRadius: '4px',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  },
};

export default FilterSidebar;
