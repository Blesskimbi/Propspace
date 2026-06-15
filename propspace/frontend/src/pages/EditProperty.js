import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FileText, DollarSign, MapPin, Image, AlertCircle } from 'lucide-react';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title:'', description:'', price:'', city:'', country:'', propertyType:'', listingType:'', imageUrls:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchProperty(); }, [id]); // eslint-disable-line

  const fetchProperty = async () => {
    try {
      setFetching(true);
      const { data } = await API.get(`/properties/${id}`);
      if (user && data.author._id.toString() !== user._id.toString()) { navigate('/dashboard'); return; }
      setFormData({ title:data.title, description:data.description, price:data.price, city:data.city, country:data.country, propertyType:data.propertyType, listingType:data.listingType, imageUrls:data.imageUrls.join(', ') });
    } catch { setError('Failed to load property details'); }
    finally { setFetching(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title||!formData.description||!formData.price||!formData.city||!formData.country||!formData.propertyType||!formData.listingType)
      return setError('Please fill in all required fields');
    if (isNaN(formData.price)||Number(formData.price)<=0) return setError('Please enter a valid price');
    try {
      setLoading(true);
      const imageUrls = formData.imageUrls ? formData.imageUrls.split(',').map(u=>u.trim()).filter(Boolean) : [];
      await API.put(`/properties/${id}`, { ...formData, price:Number(formData.price), imageUrls });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <>
      <Navbar />
      <div style={S.center}>
        <div style={S.spinner} className="ps-spinner" />
        <p style={S.loadTxt}>Loading property…</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={S.page}>
        <div style={S.pageHeader}>
          <div style={S.pageHeaderInner}>
            <p style={S.eyebrow}>My Listings</p>
            <h1 style={S.pageTitle}>Edit Listing</h1>
            <p style={S.pageSub}>Update your property details</p>
          </div>
        </div>

        <div style={S.container}>
          <div style={S.formCard}>
            {error && <div style={S.errorAlert}><AlertCircle size={15} strokeWidth={2} /> {error}</div>}

            <form onSubmit={handleSubmit}>
              <SH icon={<FileText size={15} color="#C8956C" strokeWidth={1.8} />} title="Basic Information" />
              <div style={S.field}><label style={S.label}>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} style={S.input} /></div>
              <div style={S.field}><label style={S.label}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} style={S.textarea} rows={5} /></div>

              <div style={S.divider} />
              <SH icon={<DollarSign size={15} color="#C8956C" strokeWidth={1.8} />} title="Pricing & Type" />
              <div style={S.threeCol}>
                <div style={S.field}><label style={S.label}>Price (XAF) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} style={S.input} /></div>
                <div style={S.field}><label style={S.label}>Property Type *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={S.select}>
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Studio">Studio</option>
                  </select></div>
                <div style={S.field}><label style={S.label}>Listing Type *</label>
                  <select name="listingType" value={formData.listingType} onChange={handleChange} style={S.select}>
                    <option value="">Select type</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select></div>
              </div>

              <div style={S.divider} />
              <SH icon={<MapPin size={15} color="#C8956C" strokeWidth={1.8} />} title="Location" />
              <div style={S.twoCol}>
                <div style={S.field}><label style={S.label}>City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} style={S.input} /></div>
                <div style={S.field}><label style={S.label}>Country *</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} style={S.input} /></div>
              </div>

              <div style={S.divider} />
              <SH icon={<Image size={15} color="#C8956C" strokeWidth={1.8} />} title="Images" />
              <div style={S.field}><label style={S.label}>Image URLs (comma-separated)</label>
                <input type="text" name="imageUrls" value={formData.imageUrls} onChange={handleChange} style={S.input} />
                <p style={S.hint}>Paste public image URLs separated by commas.</p></div>

              <div style={S.formFooter}>
                <button type="button" onClick={() => navigate('/dashboard')} style={S.cancelBtn}>Cancel</button>
                <button type="submit" style={S.submitBtn} disabled={loading}>
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const SH = ({ icon, title }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
    {icon}<h3 style={{ fontSize:'14px', fontWeight:700, color:'#1a1a1a' }}>{title}</h3>
  </div>
);

const S = {
  page: { minHeight:'calc(100vh - 60px)', backgroundColor:'#f5f5f5' },
  center: { minHeight:'calc(100vh - 60px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'14px' },
  spinner: { width:'34px', height:'34px', border:'3px solid #e4e0db', borderTop:'3px solid #C8956C', borderRadius:'50%' },
  loadTxt: { fontSize:'15px', color:'#888' },
  pageHeader: { backgroundColor:'#fff', borderBottom:'1px solid #e4e0db', padding:'28px 0' },
  pageHeaderInner: { maxWidth:'900px', margin:'0 auto', padding:'0 32px' },
  eyebrow: { fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#C8956C', marginBottom:'4px' },
  pageTitle: { fontSize:'24px', fontWeight:800, color:'#1a1a1a', marginBottom:'4px' },
  pageSub: { fontSize:'14px', color:'#888' },
  container: { maxWidth:'900px', margin:'0 auto', padding:'28px 32px' },
  formCard: { backgroundColor:'#fff', borderRadius:'6px', border:'1px solid #e4e0db', padding:'28px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' },
  errorAlert: { display:'flex', alignItems:'center', gap:'8px', backgroundColor:'#fff8f5', border:'1px solid #f0d0c0', color:'#c0392b', padding:'11px 14px', borderRadius:'4px', fontSize:'14px', marginBottom:'20px' },
  divider: { height:'1px', backgroundColor:'#f0ece8', margin:'22px 0' },
  field: { marginBottom:'14px' },
  label: { display:'block', fontSize:'13px', fontWeight:600, color:'#1a1a1a', marginBottom:'6px' },
  input: { width:'100%', padding:'10px 12px', borderRadius:'4px', border:'1px solid #e4e0db', fontSize:'14px', color:'#1a1a1a', outline:'none', boxSizing:'border-box', backgroundColor:'#fff' },
  select: { width:'100%', padding:'10px 12px', borderRadius:'4px', border:'1px solid #e4e0db', fontSize:'14px', color:'#1a1a1a', outline:'none', backgroundColor:'#fff', cursor:'pointer' },
  textarea: { width:'100%', padding:'10px 12px', borderRadius:'4px', border:'1px solid #e4e0db', fontSize:'14px', color:'#1a1a1a', outline:'none', resize:'vertical', fontFamily:'inherit', lineHeight:1.65, boxSizing:'border-box', backgroundColor:'#fff' },
  hint: { fontSize:'12px', color:'#bbb', marginTop:'5px' },
  twoCol: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
  threeCol: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px' },
  formFooter: { display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'8px', borderTop:'1px solid #f0ece8', paddingTop:'20px' },
  cancelBtn: { padding:'10px 22px', backgroundColor:'#f5f5f5', border:'1px solid #e4e0db', borderRadius:'4px', fontSize:'14px', fontWeight:600, color:'#444', cursor:'pointer' },
  submitBtn: { padding:'10px 28px', backgroundColor:'#C8956C', color:'#fff', border:'none', borderRadius:'4px', fontSize:'14px', fontWeight:700, cursor:'pointer' },
};

export default EditProperty;
