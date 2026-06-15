import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import { FileText, DollarSign, MapPin, Image, Lightbulb, AlertCircle } from 'lucide-react';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title:'', description:'', price:'', city:'', country:'', propertyType:'', listingType:'', imageUrls:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await API.post('/properties', { ...formData, price: Number(formData.price), imageUrls });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div style={S.page}>
        <div style={S.pageHeader}>
          <div style={S.pageHeaderInner}>
            <p style={S.eyebrow}>My Listings</p>
            <h1 style={S.pageTitle}>Create New Listing</h1>
            <p style={S.pageSub}>Fill in the details below to publish your property</p>
          </div>
        </div>

        <div style={S.container}>
          <div style={S.formCard}>
            {error && (
              <div style={S.errorAlert}><AlertCircle size={15} strokeWidth={2} /> {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <SectionHead icon={<FileText size={16} color="#C8956C" strokeWidth={1.8} />} title="Basic Information" />
              <div style={S.field}>
                <label style={S.label}>Property Title *</label>
                <input type="text" name="title" placeholder="e.g. Modern 3-Bedroom Apartment in Yaoundé"
                  value={formData.title} onChange={handleChange} style={S.input} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Description *</label>
                <textarea name="description" placeholder="Describe the property — size, amenities, nearby landmarks…"
                  value={formData.description} onChange={handleChange} style={S.textarea} rows={5} />
              </div>

              <div style={S.divider} />

              {/* Pricing */}
              <SectionHead icon={<DollarSign size={16} color="#C8956C" strokeWidth={1.8} />} title="Pricing & Type" />
              <div style={S.threeCol}>
                <div style={S.field}>
                  <label style={S.label}>Price (XAF) *</label>
                  <input type="number" name="price" placeholder="e.g. 150000"
                    value={formData.price} onChange={handleChange} style={S.input} min="0" />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Property Type *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={S.select}>
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Listing Type *</label>
                  <select name="listingType" value={formData.listingType} onChange={handleChange} style={S.select}>
                    <option value="">Select type</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </div>
              </div>

              <div style={S.divider} />

              {/* Location */}
              <SectionHead icon={<MapPin size={16} color="#C8956C" strokeWidth={1.8} />} title="Location" />
              <div style={S.twoCol}>
                <div style={S.field}>
                  <label style={S.label}>City *</label>
                  <input type="text" name="city" placeholder="e.g. Yaoundé"
                    value={formData.city} onChange={handleChange} style={S.input} />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Country *</label>
                  <input type="text" name="country" placeholder="e.g. Cameroon"
                    value={formData.country} onChange={handleChange} style={S.input} />
                </div>
              </div>

              <div style={S.divider} />

              {/* Images */}
              <SectionHead icon={<Image size={16} color="#C8956C" strokeWidth={1.8} />} title="Images" />
              <div style={S.field}>
                <label style={S.label}>Image URLs (comma-separated)</label>
                <input type="text" name="imageUrls"
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  value={formData.imageUrls} onChange={handleChange} style={S.input} />
                <p style={S.hint}>Paste public image URLs separated by commas.</p>
              </div>

              <div style={S.formFooter}>
                <button type="button" onClick={() => navigate('/dashboard')} style={S.cancelBtn}>Cancel</button>
                <button type="submit" style={S.submitBtn} disabled={loading}>
                  {loading ? 'Publishing…' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>

          {/* Tips */}
          <div style={S.tips}>
            <div style={S.tipsHeader}>
              <Lightbulb size={16} color="#C8956C" strokeWidth={1.8} />
              <h4 style={S.tipsTitle}>Tips for a great listing</h4>
            </div>
            <ul style={S.tipsList}>
              {['Use a clear, descriptive title.','Add at least 3 high-quality photos.','Mention nearby schools and transport.','Keep your price competitive.','Respond quickly to enquiries.'].map(t => (
                <li key={t} style={S.tipsItem}>
                  <span style={S.tipsBullet} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const SectionHead = ({ icon, title }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
    {icon}
    <h3 style={{ fontSize:'14px', fontWeight:700, color:'#1a1a1a' }}>{title}</h3>
  </div>
);

const S = {
  page: { minHeight:'calc(100vh - 60px)', backgroundColor:'#f5f5f5' },
  pageHeader: { backgroundColor:'#fff', borderBottom:'1px solid #e4e0db', padding:'28px 0' },
  pageHeaderInner: { maxWidth:'1100px', margin:'0 auto', padding:'0 32px' },
  eyebrow: { fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#C8956C', marginBottom:'4px' },
  pageTitle: { fontSize:'24px', fontWeight:800, color:'#1a1a1a', marginBottom:'4px' },
  pageSub: { fontSize:'14px', color:'#888' },
  container: { maxWidth:'1100px', margin:'0 auto', padding:'28px 32px', display:'grid', gridTemplateColumns:'1fr 240px', gap:'24px', alignItems:'start' },
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
  tips: { backgroundColor:'#fff', borderRadius:'6px', border:'1px solid #e4e0db', padding:'20px', position:'sticky', top:'72px' },
  tipsHeader: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' },
  tipsTitle: { fontSize:'14px', fontWeight:700, color:'#1a1a1a' },
  tipsList: { listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'10px' },
  tipsItem: { display:'flex', alignItems:'flex-start', gap:'8px', fontSize:'13px', color:'#555', lineHeight:1.5 },
  tipsBullet: { width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'#C8956C', flexShrink:0, marginTop:'6px' },
};

export default CreateProperty;
