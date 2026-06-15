import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Home, Key, Tag, Eye, Pencil, Trash2, Plus, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchMyListings(); }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true); setError('');
      const { data } = await API.get('/properties/user/my-listings');
      setProperties(data);
    } catch { setError('Failed to load your listings'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await API.delete(`/properties/${id}`);
      setProperties(properties.filter(p => p._id !== id));
    } catch { alert('Failed to delete property'); }
  };

  const fmt = (price) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  const totalRent = properties.filter(p => p.listingType === 'rent').length;
  const totalSale = properties.filter(p => p.listingType === 'sale').length;

  return (
    <>
      <Navbar />
      <div style={S.page}>

        {/* Page header */}
        <div style={S.pageHeader}>
          <div style={S.pageHeaderInner}>
            <div>
              <p style={S.eyebrow}>My Account</p>
              <h1 style={S.pageTitle}>Dashboard</h1>
              <p style={S.pageSub}>Welcome back, <strong>{user?.username}</strong></p>
            </div>
            <Link to="/create-property" style={S.addBtn}>
              <Plus size={15} strokeWidth={2.5} /> New Listing
            </Link>
          </div>
        </div>

        <div style={S.container}>
          {/* Stats */}
          <div style={S.statsRow}>
            {[
              { icon: <Home size={22} strokeWidth={1.5} color="#C8956C" />, num: properties.length, label: 'Total Listings', bg: '#fdf6f0' },
              { icon: <Key size={22} strokeWidth={1.5} color="#2C3E50" />, num: totalRent, label: 'For Rent', bg: '#f0f4f8' },
              { icon: <Tag size={22} strokeWidth={1.5} color="#C8956C" />, num: totalSale, label: 'For Sale', bg: '#fdf6f0' },
            ].map(s => (
              <div key={s.label} style={{ ...S.statCard, backgroundColor: s.bg }}>
                <div style={S.statIcon}>{s.icon}</div>
                <div>
                  <p style={S.statNum}>{s.num}</p>
                  <p style={S.statLabel}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={S.stateBox}>
              <div style={S.spinner} className="ps-spinner" />
              <p style={S.stateText}>Loading your listings…</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={S.errorBox}>
              <p>{error}</p>
              <button onClick={fetchMyListings} style={S.retryBtn}>Retry</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && properties.length === 0 && (
            <div style={S.emptyBox}>
              <Home size={40} strokeWidth={1.2} color="#C8956C" style={{ marginBottom: 14 }} />
              <p style={S.emptyTitle}>No listings yet</p>
              <p style={S.emptyText}>Create your first property listing to get started.</p>
              <Link to="/create-property" style={S.addBtn}>
                <Plus size={15} /> Create Listing
              </Link>
            </div>
          )}

          {/* Table */}
          {!loading && !error && properties.length > 0 && (
            <div style={S.tableCard}>
              <div style={S.tableHead}>
                <h3 style={S.tableTitle}>Your Listings</h3>
              </div>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {['Property', 'Type', 'Listing', 'Location', 'Price', 'Actions'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p._id} style={S.tr}>
                        <td style={S.td}>
                          <div style={S.propCell}>
                            <img
                              src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=80&q=60'}
                              alt="" style={S.propThumb}
                            />
                            <span style={S.propName}>{p.title}</span>
                          </div>
                        </td>
                        <td style={S.td}><span style={S.typeBadge}>{p.propertyType}</span></td>
                        <td style={S.td}>
                          <span style={{ ...S.listBadge, backgroundColor: p.listingType==='rent' ? '#eaf4ee' : '#fdf6f0', color: p.listingType==='rent' ? '#1e6b3c' : '#8b5e3c' }}>
                            {p.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                        </td>
                        <td style={S.td}>
                          <span style={S.locCell}><MapPin size={12} color="#C8956C" strokeWidth={2} />{p.city}, {p.country}</span>
                        </td>
                        <td style={S.td}><span style={S.priceCell}>{fmt(p.price)}</span></td>
                        <td style={S.td}>
                          <div style={S.actions}>
                            <button onClick={() => navigate(`/properties/${p._id}`)} style={S.btnView} title="View"><Eye size={14} strokeWidth={2} /></button>
                            <button onClick={() => navigate(`/edit-property/${p._id}`)} style={S.btnEdit} title="Edit"><Pencil size={14} strokeWidth={2} /></button>
                            <button onClick={() => handleDelete(p._id)} style={S.btnDelete} title="Delete"><Trash2 size={14} strokeWidth={2} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const S = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f5f5f5' },
  pageHeader: { backgroundColor: '#fff', borderBottom: '1px solid #e4e0db', padding: '28px 0' },
  pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C8956C', marginBottom: '4px' },
  pageTitle: { fontSize: '26px', fontWeight: 800, color: '#1a1a1a', marginBottom: '3px' },
  pageSub: { fontSize: '14px', color: '#888' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '10px 20px', backgroundColor: '#C8956C', color: '#fff',
    borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 700,
  },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '28px 32px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' },
  statCard: {
    borderRadius: '6px', border: '1px solid #e4e0db',
    padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '16px',
  },
  statIcon: {
    width: '48px', height: '48px', borderRadius: '50%',
    backgroundColor: 'rgba(200,149,108,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statNum: { fontSize: '28px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1, margin: 0 },
  statLabel: { fontSize: '13px', color: '#888', marginTop: '3px', fontWeight: 500 },
  stateBox: {
    textAlign: 'center', padding: '60px 20px',
    backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e4e0db',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  spinner: { width: '34px', height: '34px', border: '3px solid #e4e0db', borderTop: '3px solid #C8956C', borderRadius: '50%', marginBottom: '6px' },
  stateText: { fontSize: '15px', color: '#666' },
  errorBox: { textAlign: 'center', padding: '28px', backgroundColor: '#fff8f5', borderRadius: '6px', border: '1px solid #f0d0c0', color: '#c0392b' },
  retryBtn: { marginTop: '10px', padding: '8px 20px', backgroundColor: '#C8956C', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 },
  emptyBox: {
    textAlign: 'center', padding: '60px 30px',
    backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e4e0db',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  emptyTitle: { fontSize: '18px', fontWeight: 700, color: '#1a1a1a' },
  emptyText: { fontSize: '14px', color: '#888', marginBottom: '12px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e4e0db', overflow: 'hidden' },
  tableHead: { padding: '16px 22px', borderBottom: '1px solid #f0ece8' },
  tableTitle: { fontSize: '15px', fontWeight: 700, color: '#1a1a1a' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', backgroundColor: '#faf9f7', borderBottom: '1px solid #e4e0db' },
  tr: { borderBottom: '1px solid #f5f2ee' },
  td: { padding: '13px 16px', verticalAlign: 'middle', color: '#2d2d2d' },
  propCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  propThumb: { width: '44px', height: '36px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 },
  propName: { fontWeight: 600, color: '#1a1a1a', fontSize: '14px' },
  typeBadge: { backgroundColor: '#f0f4f8', color: '#2C3E50', padding: '3px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600 },
  listBadge: { padding: '3px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600 },
  locCell: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#666' },
  priceCell: { fontWeight: 700, color: '#2C3E50', fontSize: '14px' },
  actions: { display: 'flex', gap: '6px' },
  btnView: { padding: '7px 10px', backgroundColor: '#f0f4f8', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#2C3E50', display: 'flex', alignItems: 'center' },
  btnEdit: { padding: '7px 10px', backgroundColor: '#fdf6f0', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#C8956C', display: 'flex', alignItems: 'center' },
  btnDelete: { padding: '7px 10px', backgroundColor: '#fff5f5', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#c0392b', display: 'flex', alignItems: 'center' },
};

export default Dashboard;
