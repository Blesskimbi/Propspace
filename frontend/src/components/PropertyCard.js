import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const [hovered, setHovered] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  return (
    <div
      style={{ ...S.card, ...(hovered ? S.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={S.imgWrap}>
        <img
          src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'}
          alt={property.title}
          style={{ ...S.img, ...(hovered ? S.imgHover : {}) }}
        />
        {/* Type pill */}
        <span style={{
          ...S.pill,
          backgroundColor: property.listingType === 'rent' ? '#2C3E50' : '#C8956C',
        }}>
          {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
      </div>

      {/* Body */}
      <div style={S.body}>
        <p style={S.propType}>{property.propertyType}</p>
        <h3 style={S.title}>{property.title}</h3>

        <div style={S.locationRow}>
          <MapPin size={13} strokeWidth={2} color="#C8956C" />
          <span style={S.location}>{property.city}, {property.country}</span>
        </div>

        <div style={S.footer}>
          <p style={S.price}>{formatPrice(property.price)}</p>
          <Link to={`/properties/${property._id}`} style={S.viewBtn}>
            View <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const S = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid #e4e0db',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
  },
  imgWrap: { position: 'relative', height: '210px', overflow: 'hidden', flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' },
  imgHover: { transform: 'scale(1.04)' },
  pill: {
    position: 'absolute', top: '12px', left: '12px',
    color: '#fff', fontSize: '11px', fontWeight: 700,
    padding: '4px 10px', borderRadius: '3px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  body: { padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  propType: { fontSize: '11px', fontWeight: 700, color: '#C8956C', textTransform: 'uppercase', letterSpacing: '0.8px' },
  title: {
    fontSize: '15px', fontWeight: 700, color: '#1a1a1a',
    lineHeight: 1.35,
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  locationRow: { display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' },
  location: { fontSize: '13px', color: '#888' },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderTop: '1px solid #f0ece8', paddingTop: '12px', marginTop: 'auto',
  },
  price: { fontSize: '17px', fontWeight: 800, color: '#2C3E50' },
  viewBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '13px', fontWeight: 700, color: '#C8956C',
    textDecoration: 'none',
  },
};

export default PropertyCard;
