import { useState, useEffect } from 'react';
import API from '../hooks/useApi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Link as LinkIcon, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState({ username:'', phone:'', avatar:'' });
  const [passwordData, setPasswordData] = useState({ oldPassword:'', newPassword:'', confirmPassword:'' });
  const [profileMsg, setProfileMsg] = useState({ type:'', text:'' });
  const [passwordMsg, setPasswordMsg] = useState({ type:'', text:'' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => { fetchProfile(); }, []); // eslint-disable-line

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setProfileData({ username:data.username||'', phone:data.phone||'', avatar:data.avatar||'' });
    } catch { setProfileMsg({ type:'error', text:'Failed to load profile' }); }
  };

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type:'', text:'' });
    if (!profileData.username) return setProfileMsg({ type:'error', text:'Username cannot be empty' });
    try {
      setProfileLoading(true);
      const { data } = await API.put('/users/profile', profileData);
      login({ ...user, username:data.username, phone:data.phone, avatar:data.avatar });
      setProfileMsg({ type:'success', text:'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type:'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally { setProfileLoading(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type:'', text:'' });
    if (!passwordData.oldPassword||!passwordData.newPassword||!passwordData.confirmPassword)
      return setPasswordMsg({ type:'error', text:'Please fill in all password fields' });
    if (passwordData.newPassword !== passwordData.confirmPassword)
      return setPasswordMsg({ type:'error', text:'New passwords do not match' });
    if (passwordData.newPassword.length < 6)
      return setPasswordMsg({ type:'error', text:'New password must be at least 6 characters' });
    try {
      setPasswordLoading(true);
      await API.put('/users/change-password', { oldPassword:passwordData.oldPassword, newPassword:passwordData.newPassword });
      setPasswordMsg({ type:'success', text:'Password changed successfully!' });
      setPasswordData({ oldPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) {
      setPasswordMsg({ type:'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally { setPasswordLoading(false); }
  };

  const avatarSrc = profileData.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.username||'U')}&background=C8956C&color=fff&size=80`;

  const Msg = ({ msg }) => !msg.text ? null : (
    <div style={{ ...S.alert, ...(msg.type==='success' ? S.alertSuccess : S.alertError) }}>
      {msg.type==='success' ? <CheckCircle size={15} strokeWidth={2} /> : <AlertCircle size={15} strokeWidth={2} />}
      {msg.text}
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={S.page}>
        <div style={S.pageHeader}>
          <div style={S.pageHeaderInner}>
            <p style={S.eyebrow}>My Account</p>
            <h1 style={S.pageTitle}>Account Settings</h1>
            <p style={S.pageSub}>Manage your profile and security preferences</p>
          </div>
        </div>

        <div style={S.container}>
          {/* Identity */}
          <div style={S.identityCard}>
            <img src={avatarSrc} alt="avatar" style={S.bigAvatar} />
            <div>
              <p style={S.identityName}>{profileData.username}</p>
              <p style={S.identityEmail}>{user?.email}</p>
            </div>
          </div>

          <div style={S.grid}>
            {/* Profile form */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <User size={16} color="#C8956C" strokeWidth={1.8} />
                <h3 style={S.cardTitle}>Edit Profile</h3>
              </div>

              <Msg msg={profileMsg} />

              <form onSubmit={handleProfileSubmit}>
                <div style={S.field}>
                  <label style={S.label}>Username</label>
                  <div style={S.inputWrap}>
                    <User size={14} color="#C8956C" strokeWidth={1.8} style={S.inputIcon} />
                    <input type="text" name="username" value={profileData.username} onChange={handleProfileChange} style={S.input} />
                  </div>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Phone Number</label>
                  <div style={S.inputWrap}>
                    <Phone size={14} color="#C8956C" strokeWidth={1.8} style={S.inputIcon} />
                    <input type="text" name="phone" placeholder="+237 6XX XXX XXX" value={profileData.phone} onChange={handleProfileChange} style={S.input} />
                  </div>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Avatar URL</label>
                  <div style={S.inputWrap}>
                    <LinkIcon size={14} color="#C8956C" strokeWidth={1.8} style={S.inputIcon} />
                    <input type="text" name="avatar" placeholder="https://example.com/photo.jpg" value={profileData.avatar} onChange={handleProfileChange} style={S.input} />
                  </div>
                  {profileData.avatar && (
                    <div style={S.previewRow}>
                      <img src={profileData.avatar} alt="preview" style={S.previewImg} />
                      <span style={S.previewLabel}>Preview</span>
                    </div>
                  )}
                </div>
                <button type="submit" style={S.submitBtn} disabled={profileLoading}>
                  {profileLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Password form */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <Shield size={16} color="#C8956C" strokeWidth={1.8} />
                <h3 style={S.cardTitle}>Change Password</h3>
              </div>

              <Msg msg={passwordMsg} />

              <form onSubmit={handlePasswordSubmit}>
                {[
                  { name:'oldPassword', label:'Current Password', placeholder:'Enter current password' },
                  { name:'newPassword', label:'New Password', placeholder:'Min 6 characters' },
                  { name:'confirmPassword', label:'Confirm New Password', placeholder:'Repeat new password' },
                ].map(f => (
                  <div key={f.name} style={S.field}>
                    <label style={S.label}>{f.label}</label>
                    <div style={S.inputWrap}>
                      <Lock size={14} color="#C8956C" strokeWidth={1.8} style={S.inputIcon} />
                      <input type="password" name={f.name} placeholder={f.placeholder}
                        value={passwordData[f.name]} onChange={handlePasswordChange} style={S.input} />
                    </div>
                  </div>
                ))}

                <div style={S.pwdTips}>
                  <p style={S.pwdTipsTitle}>Password requirements</p>
                  <p style={S.pwdTipsText}>At least 6 characters, mix of letters and numbers recommended.</p>
                </div>

                <button type="submit" style={S.submitBtn} disabled={passwordLoading}>
                  {passwordLoading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const S = {
  page: { minHeight:'calc(100vh - 60px)', backgroundColor:'#f5f5f5' },
  pageHeader: { backgroundColor:'#fff', borderBottom:'1px solid #e4e0db', padding:'28px 0' },
  pageHeaderInner: { maxWidth:'960px', margin:'0 auto', padding:'0 32px' },
  eyebrow: { fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#C8956C', marginBottom:'4px' },
  pageTitle: { fontSize:'24px', fontWeight:800, color:'#1a1a1a', marginBottom:'4px' },
  pageSub: { fontSize:'14px', color:'#888' },
  container: { maxWidth:'960px', margin:'0 auto', padding:'28px 32px' },
  identityCard: { display:'flex', alignItems:'center', gap:'18px', backgroundColor:'#fff', borderRadius:'6px', border:'1px solid #e4e0db', padding:'20px 24px', marginBottom:'22px' },
  bigAvatar: { width:'60px', height:'60px', borderRadius:'50%', objectFit:'cover', border:'3px solid #f0e8e0', flexShrink:0 },
  identityName: { fontSize:'17px', fontWeight:800, color:'#1a1a1a', marginBottom:'3px' },
  identityEmail: { fontSize:'13px', color:'#888' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' },
  card: { backgroundColor:'#fff', borderRadius:'6px', border:'1px solid #e4e0db', padding:'24px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' },
  cardHead: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' },
  cardTitle: { fontSize:'15px', fontWeight:700, color:'#1a1a1a' },
  alert: { display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', borderRadius:'4px', fontSize:'13.5px', marginBottom:'16px' },
  alertSuccess: { backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0', color:'#166534' },
  alertError: { backgroundColor:'#fff8f5', border:'1px solid #f0d0c0', color:'#c0392b' },
  field: { marginBottom:'14px' },
  label: { display:'block', fontSize:'13px', fontWeight:600, color:'#1a1a1a', marginBottom:'6px' },
  inputWrap: { display:'flex', alignItems:'center', border:'1px solid #e4e0db', borderRadius:'4px', backgroundColor:'#fff', overflow:'hidden' },
  inputIcon: { padding:'0 12px', flexShrink:0 },
  input: { flex:1, padding:'10px 12px 10px 0', border:'none', outline:'none', fontSize:'14px', color:'#1a1a1a', backgroundColor:'transparent' },
  previewRow: { display:'flex', alignItems:'center', gap:'10px', marginTop:'8px' },
  previewImg: { width:'38px', height:'38px', borderRadius:'50%', objectFit:'cover', border:'2px solid #f0e8e0' },
  previewLabel: { fontSize:'12px', color:'#999' },
  pwdTips: { backgroundColor:'#faf9f7', borderRadius:'4px', padding:'11px 14px', marginBottom:'14px', border:'1px solid #f0ece8' },
  pwdTipsTitle: { fontSize:'12px', fontWeight:700, color:'#444', marginBottom:'3px' },
  pwdTipsText: { fontSize:'12px', color:'#888', lineHeight:1.5 },
  submitBtn: { width:'100%', padding:'11px', backgroundColor:'#C8956C', color:'#fff', border:'none', borderRadius:'4px', fontSize:'14px', fontWeight:700, cursor:'pointer' },
};

export default Profile;
