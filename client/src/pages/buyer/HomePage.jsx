import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  Flame,
  CheckCircle,
  Users,
  Gift,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import api from '../../api/client';
import ProductCard from '../../components/common/ProductCard';

const CATEGORIES_LIST = [
  {
    name: 'Handmade Candles',
    desc: 'Soy wax, botanicals & crackling wooden wicks',
    img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    color: '#F7EBE5'
  },
  {
    name: 'Jewellery',
    desc: 'Pressed botanicals, resin & terracotta earrings',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    color: '#EBF1EC'
  },
  {
    name: 'Crochet and Knitting',
    desc: 'Organic cotton blankets, toys & eternal blossoms',
    img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    color: '#FDF7EB'
  },
  {
    name: 'Home Décor',
    desc: 'Ceramic mugs, macramé tapestries & wall art',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    color: '#F2EDE4'
  },
  {
    name: 'Paintings and Art',
    desc: 'Original folk Madhubani & watercolor pieces',
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    color: '#EAF3EF'
  },
  {
    name: 'Greeting Cards',
    desc: 'Pressed marigold deckle-edge cards with envelopes',
    img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    color: '#F9EFE9'
  },
  {
    name: 'Gift Hampers',
    desc: 'Artisanal self-care crates & festival curations',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    color: '#F5EAE1'
  },
  {
    name: 'Personalized Gifts',
    desc: 'Custom pyrography wood nameplates & keepsakes',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    color: '#E8EFEA'
  }
];

const ARTISANS = [
  {
    name: 'Aarohi Sharma',
    shopName: 'Aarohi Botanicals & Candles',
    slug: 'aarohi-botanicals',
    city: 'Jaipur, Rajasthan',
    speciality: 'Hand-poured 100% soy candles and botanical aromatherapy',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    craft: 'Candle Maker'
  },
  {
    name: 'Kavya Patel',
    shopName: 'Kavya Knotwork & Crochet',
    slug: 'kavya-knotwork',
    city: 'Ahmedabad, Gujarat',
    speciality: 'Slow-crafted merino blankets and organic macramé wall tapestries',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    craft: 'Fiber Artist'
  },
  {
    name: 'Dhruv Verma',
    shopName: 'Mitti & Clay Studio',
    slug: 'mitti-and-clay',
    city: 'Pune, Maharashtra',
    speciality: 'Earth-fired stoneware pottery and pressed wildflower botanical resin',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    craft: 'Master Potter'
  }
];

const TESTIMONIALS = [
  {
    name: 'Ananya Deshmukh',
    city: 'Mumbai',
    quote: 'The handcrafted lavender candle arrived packaged like a precious gift with real dried flower petals. It fills my reading nook with such serene natural calmness.',
    product: 'Lavender & Dried Botanical Candle',
    rating: 5
  },
  {
    name: 'Vikram Sethi',
    city: 'Bengaluru',
    quote: 'I commissioned a personalized wood nameplate for our new house warming. The pyrography detail and teak grain are stunning. Supporting actual artisans feels deeply rewarding.',
    product: 'Hand-Engraved Teak Wood Plaque',
    rating: 5
  },
  {
    name: 'Meenakshi Iyer',
    city: 'Chennai',
    quote: 'CraftNest makes finding authentic handmade Indian artistry effortless. The ceramic coffee mug has such a gorgeous forest reactive glaze. Exceptional craftsmanship!',
    product: 'Hand-Thrown Ceramic Coffee Mug',
    rating: 5
  }
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?sort=popular&limit=4')
        ]);
        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (trendRes.data.success) setTrendingProducts(trendRes.data.products);
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 0 5.5rem 0',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #F7F1DF 0%, #EDE4CE 60%, #E3D4B6 100%)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left Hero Text */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(53, 75, 54, 0.1)',
                  color: 'var(--color-forest-green)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem'
                }}
              >
                <Sparkles size={14} color="var(--color-terracotta)" />
                <span>Handmade with Heart</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  fontWeight: '800',
                  color: 'var(--color-forest-green)',
                  lineHeight: '1.15',
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.02em'
                }}
              >
                Discover <br />
                <span style={{ color: 'var(--color-terracotta)', fontStyle: 'italic' }}>
                  Handmade
                </span> Treasures.
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: '1.65',
                  marginBottom: '2.2rem',
                  maxWidth: '520px'
                }}
              >
                Unique creations, crafted with care by independent makers. Direct from the hands and hearts of local
                potters, weavers, candle artisans, and creators across India.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <ShoppingBag size={18} />
                  <span>Shop Now</span>
                </Link>

                <Link to="/become-seller" className="btn btn-secondary btn-lg">
                  <span>Become a Seller</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Artisan Trust Points */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  marginTop: '2.8rem',
                  paddingTop: '1.8rem',
                  borderTop: '1px solid rgba(41, 45, 41, 0.12)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--color-dark-text)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={17} color="var(--color-forest-green)" />
                  <span>100% Authentic Handmade</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={17} color="var(--color-forest-green)" />
                  <span>Direct Artisan Support</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={17} color="var(--color-forest-green)" />
                  <span>Secure Pan-India Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-floating)',
                  border: '8px solid rgba(255, 255, 255, 0.85)',
                  backgroundColor: '#fff'
                }}
              >
                <img
                  src="/assets/hero-artisan.jpg"
                  alt="CraftNest Artisan Studio"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Artisan Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-terracotta-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-terracotta)'
                    }}
                  >
                    <Heart size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--color-dark-text)' }}>
                      100+ Master Artisans
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      From 22 states across India
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Curated Collections</div>
            <h2 className="section-title">Explore Popular Categories</h2>
            <p className="section-desc">
              From scented aromatherapy candles to hand-woven chunky blankets and heritage paintings, every craft tells a story.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {CATEGORIES_LIST.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  backgroundColor: cat.color,
                  border: '1px solid var(--color-border-subtle)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ height: '170px', overflow: 'hidden' }}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    className="product-img-hover"
                  />
                </div>
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--color-forest-green)' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                      {cat.desc}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: 'var(--color-terracotta)'
                    }}
                  >
                    <span>Browse collection</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Handmade Products */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-cream-light)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div className="section-subtitle">Artisan Highlights</div>
              <h2 className="section-title" style={{ margin: 0 }}>Featured Handmade Products</h2>
            </div>
            <Link to="/shop?featured=true" className="btn btn-outline">
              <span>View All Featured</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Gifts Banner */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--color-forest-green)',
          color: '#fff',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(247, 241, 223, 0.15)',
                  color: 'var(--color-warm-cream)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem'
                }}
              >
                <Gift size={14} color="#D4AF37" />
                <span>Meaningful Gifting</span>
              </div>

              <h2 style={{ color: '#fff', fontSize: '2.4rem', lineHeight: '1.2', marginBottom: '1rem' }}>
                Handcrafted & Personalized Gifts for Every Occasion
              </h2>

              <p style={{ color: '#D5DFD5', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Make weddings, birthdays, and anniversaries unforgettable. Many of our makers offer custom engravings,
                embroidered monograms, and personalized calligraphy messages.
              </p>

              <Link to="/shop?category=Personalized%20Gifts" className="btn btn-secondary btn-lg">
                <span>Explore Personalized Gifts</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <div>
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-floating)',
                  border: '4px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                  alt="Personalized Handmade Gift Hampers"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div className="section-subtitle">Community Favorites</div>
              <h2 className="section-title" style={{ margin: 0 }}>Trending in the Nest</h2>
            </div>
            <Link to="/shop?sort=popular" className="btn btn-outline">
              <span>View All Trending</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Local Artisans */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-cream-light)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Meet the Makers</div>
            <h2 className="section-title">Featured Local Artisans</h2>
            <p className="section-desc">
              Behind every product is a dedicated craftsman, independent artist, or home maker honing their slow craft.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {ARTISANS.map((artisan) => (
              <div
                key={artisan.shopName}
                className="card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1.2rem',
                  backgroundColor: '#fff'
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid var(--color-soft-beige)',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <span className="badge badge-forest" style={{ marginBottom: '8px' }}>
                    {artisan.craft}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', margin: '4px 0', color: 'var(--color-forest-green)' }}>
                    {artisan.shopName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: '600' }}>
                    {artisan.name} • {artisan.city}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                    {artisan.speciality}
                  </p>
                </div>

                <Link
                  to={`/shop?search=${encodeURIComponent(artisan.name)}`}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  <span>Visit Shop Storefront</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Real Experiences</div>
            <h2 className="section-title">Loved by Conscious Shoppers</h2>
            <p className="section-desc">
              Read verified feedback from customers who welcomed our handcrafted pieces into their homes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '4px', color: '#E89E36', marginBottom: '1rem' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="#E89E36" />
                    ))}
                  </div>
                  <p
                    style={{
                      fontStyle: 'italic',
                      color: 'var(--color-dark-text)',
                      fontSize: '0.98rem',
                      lineHeight: '1.6',
                      marginBottom: '1.25rem'
                    }}
                  >
                    "{t.quote}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
                  <div style={{ fontWeight: '700', color: 'var(--color-forest-green)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Verified Buyer • {t.city}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-terracotta)', marginTop: '4px' }}>
                    Purchased: {t.product}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
