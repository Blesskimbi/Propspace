import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import {
  Search, SlidersHorizontal, Home as HomeIcon,
  Building2, RefreshCw, Star, ArrowRight,
} from 'lucide-react';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [heroSearch, setHeroSearch] = useState({ city: '', listingType: 'rent', propertyType: '' });
  const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '', propertyType: '', listingType: '' });

  useEffect(() => { fetchProperties({}); }, []); // eslint-disable-line

  const fetchProperties = async (f) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (f.city) params.append('city', f.city);
      if (f.minPrice) params.append('minPrice', f.minPrice);
      if (f.maxPrice) params.append('maxPrice', f.maxPrice);
      if (f.propertyType) params.append('propertyType', f.propertyType);
      if (f.listingType) params.append('listingType', f.listingType);
      const { data } = await API.get(`/properties?${params.toString()}`);
      setProperties(data);
    } catch { setError('Failed to load properties.'); }
    finally { setLoading(false); }
  };

  const handleHeroSearch = () => {
    const f = { ...filters, city: heroSearch.city, listingType: heroSearch.listingType, propertyType: heroSearch.propertyType };
    setFilters(f);
    fetchProperties(f);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const applyFilters = () => fetchProperties(filters);
  const clearFilters = () => { const c = { city:'',minPrice:'',maxPrice:'',propertyType:'',listingType:'' }; setFilters(c); fetchProperties(c); };
  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO — full-bleed photo, left-aligned
          ══════════════════════════════════════════ */}
      <section style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroDimmer} />

        <div style={S.heroInner}>
          <div style={S.heroLeft}>
            {/* Stars row */}
            <div style={S.starsRow}>
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#C8956C" color="#C8956C" />)}
              <span style={S.reviewText}>5.0 &nbsp;(100+ Reviews)</span>
            </div>

            <h1 style={S.heroTitle}>
              Find the <em style={S.heroItalic}>Right Property,</em><br />
              for Your Next Move
            </h1>
            <p style={S.heroSub}>
              Browse residential and commercial properties with a team that helps buyers,
              sellers, and investors make confident decisions.
            </p>

            {/* CTA button */}
            <button style={S.heroBtn} onClick={handleHeroSearch}>
              Explore Properties &nbsp;<ArrowRight size={16} />
            </button>
          </div>

          {/* Floating property preview card */}
          <div style={S.floatCard}>
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"
              alt="featured"
              style={S.floatImg}
            />
            <div style={S.floatBody}>
              <p style={S.floatName}>Modern City Residence</p>
              <p style={S.floatPrice}>XAF 45,000,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SEARCH BAR below hero
          ══════════════════════════════════════════ */}
      <div style={S.searchWrap}>
        <div style={S.searchBar}>
          {/* Tab */}
          <div style={S.tabGroup}>
            {['rent','sale'].map(t => (
              <button
                key={t}
                style={{ ...S.tab, ...(heroSearch.listingType===t ? S.tabActive : {}) }}
                onClick={() => setHeroSearch({ ...heroSearch, listingType: t })}
              >
                {t === 'rent' ? 'For Rent' : 'For Sale'}
              </button>
            ))}
          </div>

          <div style={S.searchDivider} />

          {/* City input */}
          <div style={S.searchField}>
            <Search size={16} color="#888" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="City or location…"
              value={heroSearch.city}
              onChange={e => setHeroSearch({ ...heroSearch, city: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleHeroSearch()}
              style={S.searchInput}
            />
          </div>

          <div style={S.searchDivider} />

          {/* Property type */}
          <div style={S.searchField}>
            <Building2 size={16} color="#888" strokeWidth={1.8} />
            <select
              value={heroSearch.propertyType}
              onChange={e => setHeroSearch({ ...heroSearch, propertyType: e.target.value })}
              style={{ ...S.searchInput, S: 'pointer' }}
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
            </select>
          </div>

          <button style={S.searchBtn} onClick={handleHeroSearch}>
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SERVICE CARDS SECTION
          ══════════════════════════════════════════ */}
      <section style={S.servicesSection}>
        <div style={S.servicesInner}>
          <div style={S.servicesTitleWrap}>
            <h2 style={S.servicesTitle}>
              Buy, Rent &amp; Sell<br />
              <em style={S.servicesTitleItalic}>Properties with Confidence</em>
            </h2>
          </div>

          <div style={S.serviceCards}>
            {[
              {
                icon: <HomeIcon size={28} strokeWidth={1.5} color="#C8956C" />,
                title: 'Buy a Property',
                desc: 'Access a curated selection of homes and investment properties designed to meet every budget and lifestyle.',
                link: '/?listingType=sale',
                cta: 'Explore Listings',
              },
              {
                icon: <Building2 size={28} strokeWidth={1.5} color="#C8956C" />,
                title: 'Rent a Home',
                desc: 'Find apartments, family homes, and rental spaces that offer comfort, convenience, and flexible living options.',
                link: '/?listingType=rent',
                cta: 'View Rentals',
                featured: true,
              },
              {
                icon: <RefreshCw size={28} strokeWidth={1.5} color="#C8956C" />,
                title: 'Sell Your Property',
                desc: 'Present your property with clear listing support and guidance designed to help attract serious buyers.',
                link: '/create-property',
                cta: 'Start Selling',
              },
            ].map(card => (
              <div key={card.title} style={{ ...S.serviceCard, ...(card.featured ? S.serviceCardFeatured : {}) }}>
                <div style={S.serviceIconWrap}>{card.icon}</div>
                <h3 style={S.serviceCardTitle}>{card.title}</h3>
                <p style={S.serviceCardDesc}>{card.desc}</p>
                <Link to={card.link} style={S.serviceCardLink}>{card.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LISTINGS
          ══════════════════════════════════════════ */}
      <section id="listings" style={S.listingsSection}>
        <div style={S.listingsInner}>

          {/* Header */}
          <div style={S.listingsHeader}>
            <div>
              <h2 style={S.listingsTitle}>
                {loading ? 'Loading…' : hasFilters ? `${properties.length} Properties Found` : 'All Properties'}
              </h2>
              {hasFilters && (
                <p style={S.listingsSub}>
                  Filtered &nbsp;·&nbsp;
                  <button onClick={clearFilters} style={S.clearBtn}>Clear all</button>
                </p>
              )}
            </div>
            <button style={S.filterToggle} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={15} strokeWidth={2} />
              Filters
              {hasFilters && <span style={S.filterDot} />}
            </button>
          </div>

          {/* Filter bar */}
          {showFilters && (
            <div style={S.filterBar}>
              {[
                { label: 'Listing Type', name: 'listingType', type: 'select', opts: [['','All'],['rent','For Rent'],['sale','For Sale']] },
                { label: 'Property Type', name: 'propertyType', type: 'select', opts: [['','All Types'],['Apartment','Apartment'],['House','House'],['Studio','Studio']] },
                { label: 'City', name: 'city', type: 'text', placeholder: 'e.g. Yaoundé' },
                { label: 'Min Price (XAF)', name: 'minPrice', type: 'number', placeholder: '0' },
                { label: 'Max Price (XAF)', name: 'maxPrice', type: 'number', placeholder: 'Any' },
              ].map(f => (
                <div key={f.name} style={S.filterGroup}>
                  <label style={S.filterLabel}>{f.label}</label>
                  {f.type === 'select'
                    ? <select name={f.name} value={filters[f.name]} onChange={e => setFilters({...filters,[e.target.name]:e.target.value})} style={S.filterCtrl}>
                        {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    : <input type={f.type} name={f.name} placeholder={f.placeholder} value={filters[f.name]} onChange={e => setFilters({...filters,[e.target.name]:e.target.value})} style={S.filterCtrl} />
                  }
                </div>
              ))}
              <button style={S.applyBtn} onClick={applyFilters}>Apply</button>
            </div>
          )}

          {/* States */}
          {loading && (
            <div style={S.stateBox}>
              <div style={S.spinner} className="ps-spinner" />
              <p style={S.stateText}>Fetching properties…</p>
            </div>
          )}
          {error && !loading && (
            <div style={S.errorBox}>
              <p style={S.errorTxt}>{error}</p>
              <button onClick={() => fetchProperties(filters)} style={S.retryBtn}>Try Again</button>
            </div>
          )}
          {!loading && !error && properties.length === 0 && (
            <div style={S.stateBox}>
              <Search size={40} color="#C8956C" strokeWidth={1.4} style={{ marginBottom: 12 }} />
              <p style={S.stateTitle}>No properties found</p>
              <p style={S.stateSub}>Try a different city or remove some filters.</p>
              {hasFilters && <button onClick={clearFilters} style={S.retryBtn}>Clear Filters</button>}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && properties.length > 0 && (
            <div style={S.grid}>
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER CTA
          ══════════════════════════════════════════ */}
      <section style={S.cta}>
        <div style={S.ctaInner}>
          <p style={S.ctaEye}>Ready to list?</p>
          <h2 style={S.ctaTitle}>
            Have a Property<br /><em style={S.ctaItalic}>to Sell or Rent?</em>
          </h2>
          <p style={S.ctaSub}>Reach thousands of verified buyers and tenants — for free.</p>
          <Link to="/register" style={S.ctaBtn}>Get Started →</Link>
        </div>
      </section>

      <footer style={S.footer}>
        <p style={S.footerTxt}>© {new Date().getFullYear()} PropSpace · Cameroon Real Estate Platform</p>
      </footer>
    </>
  );
};

/* ── Styles ── */
const S = {
  /* Hero */
  hero: { position:'relative', minHeight:'580px', display:'flex', alignItems:'center', overflow:'hidden' },
  heroBg: {
    position:'absolute', inset:0,
    backgroundImage:`url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80")`,
    backgroundSize:'cover', backgroundPosition:'center',
  },
  heroDimmer: {
    position:'absolute', inset:0,
    background:'linear-gradient(to right, rgba(26,30,40,0.82) 0%, rgba(26,30,40,0.45) 60%, rgba(26,30,40,0.15) 100%)',
  },
  heroInner: {
    position:'relative', width:'100%', maxWidth:'1280px',
    margin:'0 auto', padding:'80px 40px',
    display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:'40px',
  },
  heroLeft: { maxWidth:'520px' },
  starsRow: { display:'flex', alignItems:'center', gap:'4px', marginBottom:'18px' },
  reviewText: { color:'rgba(255,255,255,0.7)', fontSize:'13px', marginLeft:'6px' },
  heroTitle: {
    fontSize:'50px', fontWeight:800, color:'#fff',
    lineHeight:1.12, letterSpacing:'-1.5px', marginBottom:'16px',
    fontFamily:"'Playfair Display', Georgia, serif",
  },
  heroItalic: { fontStyle:'italic', fontFamily:"'Playfair Display', Georgia, serif" },
  heroSub: { fontSize:'16px', color:'rgba(255,255,255,0.72)', lineHeight:1.7, marginBottom:'32px', fontWeight:400 },
  heroBtn: {
    display:'inline-flex', alignItems:'center', gap:'8px',
    padding:'13px 28px',
    backgroundColor:'#C8956C', color:'#fff',
    border:'none', borderRadius:'4px',
    fontSize:'15px', fontWeight:600, cursor:'pointer',
    letterSpacing:'0.2px',
  },

  /* Float card */
  floatCard: {
    backgroundColor:'#fff', borderRadius:'8px',
    overflow:'hidden', width:'240px', flexShrink:0,
    boxShadow:'0 16px 48px rgba(0,0,0,0.35)',
    alignSelf:'flex-end',
  },
  floatImg: { width:'100%', height:'150px', objectFit:'cover' },
  floatBody: { padding:'14px 16px' },
  floatName: { fontSize:'14px', fontWeight:700, color:'#1a1a1a', marginBottom:'4px' },
  floatPrice: { fontSize:'14px', color:'#C8956C', fontWeight:600 },

  /* Search bar */
  searchWrap: { backgroundColor:'#fff', borderBottom:'1px solid #e4e0db', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  searchBar: {
    maxWidth:'1100px', margin:'0 auto', padding:'0 32px',
    height:'62px', display:'flex', alignItems:'center', gap:'0',
  },
  tabGroup: { display:'flex', gap:'4px', paddingRight:'16px' },
  tab: {
    padding:'6px 16px', border:'1px solid #e4e0db', borderRadius:'4px',
    backgroundColor:'#f5f5f5', color:'#888', fontSize:'13px', fontWeight:600, cursor:'pointer',
  },
  tabActive: { backgroundColor:'#2C3E50', borderColor:'#2C3E50', color:'#fff' },
  searchDivider: { width:'1px', height:'28px', backgroundColor:'#e4e0db', flexShrink:0, margin:'0 4px' },
  searchField: { flex:1, display:'flex', alignItems:'center', gap:'8px', padding:'0 14px' },
  searchInput: {
    flex:1, border:'none', outline:'none',
    fontSize:'14px', color:'#1a1a1a', backgroundColor:'transparent',
    padding:'4px 0',
  },
  searchBtn: {
    display:'flex', alignItems:'center', gap:'8px',
    padding:'0 24px', height:'40px',
    backgroundColor:'#C8956C', color:'#fff',
    border:'none', borderRadius:'4px',
    fontSize:'14px', fontWeight:700, cursor:'pointer',
    marginLeft:'12px', flexShrink:0,
  },

  /* Services */
  servicesSection: { backgroundColor:'#f0ece8', padding:'80px 24px' },
  servicesInner: { maxWidth:'1100px', margin:'0 auto' },
  servicesTitleWrap: { textAlign:'center', marginBottom:'52px' },
  servicesTitle: {
    fontSize:'36px', fontWeight:800, color:'#1a1a1a', lineHeight:1.3,
    fontFamily:"'Playfair Display', Georgia, serif",
  },
  servicesTitleItalic: { fontStyle:'italic' },
  serviceCards: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' },
  serviceCard: {
    backgroundColor:'#fff', borderRadius:'6px',
    padding:'36px 28px', textAlign:'center',
    border:'1px solid #e4e0db',
    display:'flex', flexDirection:'column', alignItems:'center', gap:'14px',
  },
  serviceCardFeatured: { backgroundColor:'#f0ece8', border:'1px solid #d4c4b8' },
  serviceIconWrap: {
    width:'62px', height:'62px', borderRadius:'50%',
    backgroundColor:'rgba(200,149,108,0.12)',
    display:'flex', alignItems:'center', justifyContent:'center',
  },
  serviceCardTitle: { fontSize:'18px', fontWeight:700, color:'#1a1a1a' },
  serviceCardDesc: { fontSize:'14px', color:'#666', lineHeight:1.7, textAlign:'center' },
  serviceCardLink: { fontSize:'14px', color:'#C8956C', fontWeight:600, textDecoration:'none', marginTop:'4px' },

  /* Listings */
  listingsSection: { backgroundColor:'#f5f5f5', padding:'56px 0 80px' },
  listingsInner: { maxWidth:'1280px', margin:'0 auto', padding:'0 32px' },
  listingsHeader: {
    display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px',
  },
  listingsTitle: { fontSize:'22px', fontWeight:800, color:'#1a1a1a', marginBottom:'3px' },
  listingsSub: { fontSize:'13px', color:'#888' },
  clearBtn: { background:'none', border:'none', color:'#C8956C', fontWeight:600, fontSize:'13px', cursor:'pointer', padding:0 },
  filterToggle: {
    display:'flex', alignItems:'center', gap:'7px',
    padding:'9px 16px', backgroundColor:'#fff',
    border:'1px solid #e4e0db', borderRadius:'4px',
    fontSize:'13.5px', fontWeight:600, color:'#2C3E50', cursor:'pointer',
    position:'relative',
  },
  filterDot: { width:'7px', height:'7px', borderRadius:'50%', backgroundColor:'#C8956C' },
  filterBar: {
    display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'flex-end',
    backgroundColor:'#fff', border:'1px solid #e4e0db', borderRadius:'6px',
    padding:'18px 20px', marginBottom:'24px',
  },
  filterGroup: { display:'flex', flexDirection:'column', gap:'5px', minWidth:'140px' },
  filterLabel: { fontSize:'11px', fontWeight:700, color:'#999', textTransform:'uppercase', letterSpacing:'0.5px' },
  filterCtrl: {
    padding:'8px 10px', borderRadius:'4px',
    border:'1px solid #e4e0db', fontSize:'13px', color:'#1a1a1a',
    outline:'none', backgroundColor:'#fff', cursor:'pointer',
  },
  applyBtn: {
    alignSelf:'flex-end', padding:'9px 22px',
    backgroundColor:'#C8956C', color:'#fff',
    border:'none', borderRadius:'4px',
    fontSize:'13px', fontWeight:700, cursor:'pointer',
  },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(295px,1fr))', gap:'22px' },

  /* State boxes */
  stateBox: {
    textAlign:'center', padding:'70px 20px',
    backgroundColor:'#fff', borderRadius:'8px',
    border:'1px solid #e4e0db',
    display:'flex', flexDirection:'column', alignItems:'center', gap:'8px',
  },
  stateTitle: { fontSize:'17px', fontWeight:700, color:'#1a1a1a' },
  stateSub: { fontSize:'14px', color:'#888' },
  stateText: { fontSize:'15px', color:'#666' },
  spinner: {
    width:'36px', height:'36px',
    border:'3px solid #e4e0db',
    borderTop:'3px solid #C8956C',
    borderRadius:'50%', marginBottom:'8px',
  },
  errorBox: {
    textAlign:'center', padding:'40px 20px',
    backgroundColor:'#fff8f5', borderRadius:'8px', border:'1px solid #f0d0c0', marginBottom:'24px',
  },
  errorTxt: { fontSize:'15px', color:'#c0392b', marginBottom:'14px' },
  retryBtn: {
    marginTop:'8px', padding:'9px 24px',
    backgroundColor:'#C8956C', color:'#fff',
    border:'none', borderRadius:'4px', fontSize:'14px', fontWeight:600, cursor:'pointer',
  },

  /* CTA */
  cta: { backgroundColor:'#2C3E50', padding:'72px 24px', textAlign:'center' },
  ctaInner: { maxWidth:'560px', margin:'0 auto' },
  ctaEye: { fontSize:'12px', fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#C8956C', marginBottom:'12px' },
  ctaTitle: {
    fontSize:'36px', fontWeight:800, color:'#fff', marginBottom:'12px',
    fontFamily:"'Playfair Display', Georgia, serif", lineHeight:1.25,
  },
  ctaItalic: { fontStyle:'italic' },
  ctaSub: { fontSize:'16px', color:'rgba(255,255,255,0.65)', marginBottom:'28px', lineHeight:1.6 },
  ctaBtn: {
    display:'inline-block', padding:'13px 32px',
    backgroundColor:'#C8956C', color:'#fff',
    borderRadius:'4px', fontSize:'15px', fontWeight:700,
    textDecoration:'none',
  },

  /* Footer */
  footer: { backgroundColor:'#1e2a38', padding:'18px 24px', textAlign:'center' },
  footerTxt: { fontSize:'13px', color:'rgba(255,255,255,0.35)' },
};

export default HomePage;
