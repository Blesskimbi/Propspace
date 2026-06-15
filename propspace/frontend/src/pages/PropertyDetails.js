import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { MapPin, Mail, Phone, Pencil, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { fetchProperty(); }, [id]); // eslint-disable-line

  const fetchProperty = async () => {
    try {
      setLoading(true); setError('');
      const { data } = await API.get(`/properties/${id}`);
      setProperty(data);
    } catch { setError('Property not found or failed to load.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this property?')) return;
    try {
      setDeleting(true);
      await API.delete(`/properties/${id}`);
      navigate('/dashboard');
    } catch { alert('Failed to delete property'); }
    finally { setDeleting(false); }
  };

  const isOwner = user && property && property.author._id.toString() === user._id.toString();
  const fmt = (price) => new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
  const images = property?.imageUrls?.length
    ? property.imageUrls
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80'];

  return (
    <>
      <Navbar />

      {loading && (
        <div style={S.center}>
          <div style={S.spinner} className="ps-spinner" />
          <p style={S.loadTxt}>Loading property…</p>
        </div>
      )}

      {error && !loading && (
        <div style={S.center}>
          <div style={S.errorBox}>
            <p style={S.errorTxt}>{error}</p>
            <Link to="/" style={S.backBtn}><ArrowLeft size={14} /> Back to Listings</Link>
          </div>
        </div>
      )}

      {!loading && !error && property && (
        <div style={S.page}>
          {/* Breadcrumb */}
          <div style={S.breadcrumb}>
            <Link to="/" style={S.breadLink}>Properties</Link>
            <ChevronRight size={14} color="#bbb" strokeWidth={2} />
            <span style={S.breadCurrent}>{property.title}</span>
          </div>

          <div style={S.layout}>
            {/* ── Left ── */}
            <div style={S.left}>
              <div style={S.imgMain}>
                <img src={images[activeImg]} alt={property.title} style={S.mainImg} />
                <span style={{ ...S.listingPill, backgroundColor: property.listingType==='rent'?'#2C3E50':'#C8956C' }}>
                  {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>

              {images.length > 1 && (
                <div style={S.thumbRow}>
                  {images.map((url, i) => (
                    <img key={i} src={url} alt="" onClick={() => setActiveImg(i)}
                      style={{ ...S.thumb, ...(i===activeImg ? S.thumbActive : {}) }} />
                  ))}
                </div>
              )}

              <div style={S.card}>
                <h3 style={S.cardTitle}>About This Property</h3>
                <p style={S.description}>{property.description}</p>
              </div>
            </div>

            {/* ── Right ── */}
            <div style={S.right}>
              {/* Price + title */}
              <div style={S.card}>
                <span style={S.propTypePill}>{property.propertyType}</span>
                <h1 style={S.propTitle}>{property.title}</h1>
                <div style={S.locationRow}>
                  <MapPin size={14} strokeWidth={2} color="#C8956C" />
                  <span style={S.location}>{property.city}, {property.country}</span>
                </div>
                <p style={S.price}>{fmt(property.price)}</p>

                {isOwner && (
                  <div style={S.ownerActions}>
                    <Link to={`/edit-property/${property._id}`} style={S.editBtn}>
                      <Pencil size={14} strokeWidth={2} /> Edit
                    </Link>
                    <button onClick={handleDelete} style={S.deleteBtn} disabled={deleting}>
                      <Trash2 size={14} strokeWidth={2} />
                      {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              {/* Agent card */}
              <div style={S.card}>
                <h3 style={S.cardTitle}>Listed By</h3>
                <div style={S.agentRow}>
                  <img
                    src={property.author.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(property.author.username)}&background=C8956C&color=fff&size=56`}
                    alt={property.author.username} style={S.agentAvatar}
                  />
                  <div>
                    <p style={S.agentName}>{property.author.username}</p>
                    <div style={S.agentDetail}><Mail size={13} color="#C8956C" strokeWidth={1.8} />{property.author.email}</div>
                    {property.author.phone && (
                      <div style={S.agentDetail}><Phone size={13} color="#C8956C" strokeWidth={1.8} />{property.author.phone}</div>
                    )}
                  </div>
                </div>
                <a href={`mailto:${property.author.email}`} style={S.contactBtn}>Contact Agent</a>
              </div>

              <Link to="/" style={S.backLink}><ArrowLeft size={14} strokeWidth={2} /> Back to all listings</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const S = {
  center: { minHeight:'calc(100vh - 60px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' },
  spinner: { width:'36px', height:'36px', border:'3px solid #e4e0db', borderTop:'3px solid #C8956C', borderRadius:'50%' },
  loadTxt: { fontSize:'15px', color:'#888' },
  errorBox: { textAlign:'center', padding:'36px 32px', backgroundColor:'#fff8f5', borderRadius:'6px', border:'1px solid #f0d0c0' },
  errorTxt: { color:'#c0392b', fontSize:'15px', marginBottom:'16px' },
  backBtn: { display:'inline-flex', alignItems:'center', gap:'6px', padding:'9px 20px', backgroundColor:'#C8956C', color:'#fff', borderRadius:'4px', textDecoration:'none', fontSize:'14px', fontWeight:600 },
  page: { maxWidth:'1280px', margin:'0 auto', padding:'28px 32px 60px' },
  breadcrumb: { display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#999', marginBottom:'22px' },
  breadLink: { color:'#C8956C', fontWeight:600, textDecoration:'none' },
  breadCurrent: { color:'#444', fontWeight:500, maxWidth:'300px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  layout: { display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px', alignItems:'start' },
  left: { display:'flex', flexDirection:'column', gap:'16px' },
  right: { display:'flex', flexDirection:'column', gap:'16px', position:'sticky', top:'72px' },
  imgMain: { position:'relative', borderRadius:'6px', overflow:'hidden', height:'420px', backgroundColor:'#e4e0db' },
  mainImg: { width:'100%', height:'100%', objectFit:'cover' },
  listingPill: { position:'absolute', top:'14px', left:'14px', color:'#fff', fontSize:'11px', fontWeight:700, padding:'5px 12px', borderRadius:'3px', textTransform:'uppercase', letterSpacing:'0.5px' },
  thumbRow: { display:'flex', gap:'8px', overflowX:'auto' },
  thumb: { width:'78px', height:'58px', borderRadius:'4px', objectFit:'cover', cursor:'pointer', border:'2px solid transparent', flexShrink:0, opacity:0.7, transition:'opacity 0.2s, border-color 0.2s' },
  thumbActive: { border:'2px solid #C8956C', opacity:1 },
  card: { backgroundColor:'#fff', borderRadius:'6px', border:'1px solid #e4e0db', padding:'22px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' },
  cardTitle: { fontSize:'15px', fontWeight:700, color:'#1a1a1a', marginBottom:'12px' },
  description: { fontSize:'15px', color:'#4a4a4a', lineHeight:1.75 },
  propTypePill: { display:'inline-block', backgroundColor:'#fdf6f0', color:'#C8956C', padding:'4px 12px', borderRadius:'3px', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'10px' },
  propTitle: { fontSize:'22px', fontWeight:800, color:'#1a1a1a', marginBottom:'8px', lineHeight:1.25, fontFamily:"'Playfair Display', Georgia, serif" },
  locationRow: { display:'flex', alignItems:'center', gap:'5px', marginBottom:'12px' },
  location: { fontSize:'14px', color:'#888' },
  price: { fontSize:'26px', fontWeight:800, color:'#2C3E50', marginBottom:'16px' },
  ownerActions: { display:'flex', gap:'10px', borderTop:'1px solid #f0ece8', paddingTop:'16px' },
  editBtn: { flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'9px 0', backgroundColor:'#2C3E50', color:'#fff', borderRadius:'4px', textDecoration:'none', fontSize:'13px', fontWeight:700 },
  deleteBtn: { flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'9px 0', backgroundColor:'#fff5f5', color:'#c0392b', border:'1px solid #fbd0d0', borderRadius:'4px', fontSize:'13px', fontWeight:700, cursor:'pointer' },
  agentRow: { display:'flex', gap:'14px', alignItems:'center', marginBottom:'16px' },
  agentAvatar: { width:'50px', height:'50px', borderRadius:'50%', objectFit:'cover', flexShrink:0 },
  agentName: { fontWeight:700, fontSize:'15px', color:'#1a1a1a', marginBottom:'5px' },
  agentDetail: { display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#666', marginBottom:'3px' },
  contactBtn: { display:'block', textAlign:'center', padding:'10px', backgroundColor:'#C8956C', color:'#fff', borderRadius:'4px', textDecoration:'none', fontSize:'14px', fontWeight:700 },
  backLink: { display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#C8956C', fontWeight:600, textDecoration:'none' },
};

export default PropertyDetails;
