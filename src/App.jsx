import { useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check,
  ChevronDown, ChevronRight, Clock3, Droplets, Facebook, Hammer,
  Instagram, MapPin, Menu, Paintbrush, PlugZap, Search, ShieldCheck,
  Sparkles, Star, Wind, X, Wrench, CarFront, Scissors, Zap,
} from 'lucide-react'

const services = [
  { name: 'Plumbing', detail: 'Pipes, taps & leaks', icon: Droplets },
  { name: 'Electrical', detail: 'Wiring, lights & power', icon: PlugZap },
  { name: 'Cleaning', detail: 'A fresh start at home', icon: Sparkles },
  { name: 'AC Repair', detail: 'Cool air, made easy', icon: Wind },
  { name: 'Carpentry', detail: 'Furniture & fittings', icon: Hammer },
  { name: 'Painting', detail: 'Give your space new life', icon: Paintbrush },
  { name: 'Mechanic', detail: 'Mobile auto care', icon: CarFront },
  { name: 'Beauty & Salon', detail: 'Care that comes to you', icon: Scissors },
]

const testimonials = [
  { quote: 'My plumber arrived on time, explained the fix clearly, and the price was exactly what I was quoted. That kind of peace of mind is priceless.', name: 'Amaka Okafor', area: 'Lekki, Lagos', initials: 'AO' },
  { quote: 'Booking an electrician took less than five minutes. I could compare ratings first, and the whole process felt safe and simple.', name: 'Tunde Adeyemi', area: 'Ikeja, Lagos', initials: 'TA' },
  { quote: 'As a service provider, I have found great customers and grown my business. I get to choose my schedule and manage jobs from my phone.', name: 'Chika Nwosu', area: 'Service provider', initials: 'CN' },
]

const nav = [
  ['How it works', 'how-it-works'],
  ['Services', 'services'],
  ['For providers', 'providers'],
]

function Logo({ footer = false }) {
  return <a className={`brand${footer ? ' brand-footer' : ''}`} href="#home" aria-label="ServiceConnect home">
    <span className="brand-mark"><Wrench size={21} strokeWidth={2.6} /></span>
    <span>Service<span>Connect</span></span>
  </a>
}

function PhonePreview() {
  return <div className="phone-scene" aria-label="Preview of the ServiceConnect mobile app">
    <div className="phone-glow" />
    <div className="phone-frame">
      <div className="phone-screen">
        <div className="phone-status"><span>9:41</span><span>● ● ●</span></div>
        <div className="phone-notch" />
        <div className="phone-content">
          <div className="phone-top"><div><small>Good morning, Amaka</small><strong>What do you need?</strong></div><span className="avatar-small">A</span></div>
          <div className="phone-location"><MapPin size={13} /> Lekki Phase 1, Lagos <ChevronDown size={13} /></div>
          <div className="phone-heading"><strong>Popular services</strong><span>See all</span></div>
          <div className="phone-services">{services.slice(0, 4).map(({ name, icon: Icon }) => <div className="phone-service" key={name}><span><Icon size={17} /></span><small>{name}</small></div>)}</div>
          <div className="phone-promo"><small>Need a hand at home?</small><strong>Find your expert</strong><span>Book a service <ArrowRight size={12} /></span></div>
          <div className="phone-heading"><strong>Top professionals</strong><span>View all</span></div>
          <div className="phone-pro"><span className="pro-avatar">JO</span><span><b>James Okafor</b><small>Plumber · 4.9 ★</small></span><BadgeCheck size={16} /></div>
          <div className="phone-pro"><span className="pro-avatar alt">FA</span><span><b>Feyi Adebayo</b><small>Electrician · 5.0 ★</small></span><BadgeCheck size={16} /></div>
        </div>
        <div className="phone-home" />
      </div>
    </div>
    <div className="float-note note-top"><span className="note-icon"><BadgeCheck size={18} /></span><span><b>Verified experts</b><small>Ready when you are</small></span></div>
    <div className="float-note note-bottom"><span className="mini-faces"><i>AO</i><i>TA</i><i>CN</i></span><span><b>4.8 out of 5</b><small>Loved across Lagos</small></span></div>
  </div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All services')

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return services.filter((service) => !normalized || `${service.name} ${service.detail}`.toLowerCase().includes(normalized))
  }, [query])

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const sendLink = (event) => {
    event.preventDefault()
    if (phone.trim()) setSent(true)
  }

  return <div className="site-shell" id="home">
    <header className="site-header">
      <nav className="nav wrap" aria-label="Main navigation">
        <Logo />
        <div className="nav-links">{nav.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}</div>
        <div className="nav-actions"><a className="button button-outline button-small" href="#get-app">Log in</a><a className="button button-primary button-small" href="#get-app">Get the app <ArrowUpRight size={15} /></a></div>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </nav>
      {menuOpen && <div className="mobile-menu">{nav.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}<a href="#get-app" className="button button-primary" onClick={() => setMenuOpen(false)}>Get the app <ArrowRight size={16} /></a></div>}
    </header>

    <main>
      <section className="hero" id="home-hero"><div className="wrap hero-grid">
        <div className="hero-copy fade-in"><div className="eyebrow"><span className="live-dot" /> LAGOS’ TRUSTED SERVICE MARKETPLACE</div>
          <h1>Trusted help for your home, <em>right around you.</em></h1>
          <p className="hero-lede">Find verified service experts near you in minutes. Book, track, and pay — all from one simple app.</p>
          <form className="search-box" onSubmit={(e) => { e.preventDefault(); goTo('services') }}><Search size={19} /><input aria-label="Search for a service" placeholder="What service do you need today?" value={query} onChange={(e) => setQuery(e.target.value)} /><span className="search-divider" /><button type="submit" aria-label="Search services"><ArrowRight size={18} /></button></form>
          <div className="hero-buttons"><a className="button button-primary" href="#get-app">Download the app <ArrowRight size={17} /></a><a className="button button-plain" href="#providers">Become a provider <ArrowUpRight size={16} /></a></div>
          <div className="hero-proof"><div className="proof-avatars"><i>AO</i><i>TA</i><i>CN</i><i>+</i></div><div><span className="stars">★★★★★</span><p><b>15,000+</b> happy customers in Lagos</p></div></div>
        </div>
        <div className="hero-art"><PhonePreview /></div>
      </div></section>

      <section className="trust-strip"><div className="wrap trust-grid">{[['5,000+', 'Verified professionals'], ['15,000+', 'Happy customers'], ['4.8/5', 'Average rating'], ['98%', 'Jobs completed']].map(([num, label]) => <div className="trust-item" key={label}><strong>{num}</strong><span>{label}</span></div>)}</div></section>

      <section className="section how-section" id="how-it-works"><div className="wrap"><div className="section-heading centered"><span className="eyebrow blue-eyebrow">HOW IT WORKS</span><h2>Getting it done is <em>easy.</em></h2><p>From your first search to the finishing touch, we’ve got you.</p></div><div className="steps-grid">{[
        { n: '01', title: 'Tell us what you need', text: 'Pick a service and share a few details about the job.', icon: Search },
        { n: '02', title: 'Choose your expert', text: 'Compare verified pros by ratings, experience, and price.', icon: BadgeCheck },
        { n: '03', title: 'Book & relax', text: 'Track your booking, then pay securely when the work is done.', icon: Check },
      ].map(({ n, title, text, icon: Icon }) => <article className="step-card" key={n}><div className="step-top"><span className="step-icon"><Icon size={23} /></span><span className="step-num">{n}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="section services-section" id="services"><div className="wrap"><div className="section-heading services-heading"><div><span className="eyebrow blue-eyebrow">HELP FOR EVERYDAY LIFE</span><h2>Meet your next <em>go-to pro.</em></h2></div><p>Skilled local experts for all the jobs that make a house feel like home.</p></div><div className="service-toolbar"><div className="filter-pills">{['All services', 'Home', 'Auto', 'Personal care'].map((filter) => <button className={activeFilter === filter ? 'filter-pill selected' : 'filter-pill'} key={filter} onClick={() => { setActiveFilter(filter); if (filter === 'Auto') setQuery('mechanic'); else if (filter === 'Personal care') setQuery('beauty'); else if (filter === 'Home') setQuery(''); else setQuery('') }}>{filter}</button>)}</div><span className="service-count">{filteredServices.length} services <ArrowDown size={14} /></span></div><div className="services-grid">{filteredServices.map(({ name, detail, icon: Icon }) => <a href="#get-app" className="service-card" key={name}><span className="service-icon"><Icon size={24} /></span><span className="service-card-text"><b>{name}</b><small>{detail}</small></span><ChevronRight className="service-arrow" size={18} /></a>)}</div>{filteredServices.length === 0 && <div className="empty-state">No services match “{query}”. Try another search.</div>}<div className="service-footnote"><ShieldCheck size={17} /> Every professional is reviewed and verified before joining.</div></div></section>

      <section className="section why-section" id="providers"><div className="wrap why-grid"><div className="why-copy"><span className="eyebrow blue-eyebrow">WHY SERVICECONNECT</span><h2>Good people.<br /><em>Great work.</em></h2><p>We bring customers and skilled professionals together with the trust, tools, and support to make every job a good one.</p><a href="#get-app" className="text-link">See how it works <ArrowRight size={16} /></a><div className="why-points">{[['Verified IDs', 'Know who’s coming to your home.'], ['Secure payments', 'Easy payment with no surprises.'], ['Service support', 'We’re here if you need a hand.']].map(([t, d]) => <div className="why-point" key={t}><span><Check size={14} /></span><p><b>{t}</b><small>{d}</small></p></div>)}</div></div><div className="provider-card"><div className="provider-orbit orbit-one"/><div className="provider-orbit orbit-two"/><div className="provider-card-content"><span className="provider-icon"><Wrench size={24} /></span><span className="provider-label">FOR SERVICE PROFESSIONALS</span><h3>More jobs.<br />On your terms.</h3><p>Grow your business, connect with new customers, and take control of your schedule.</p><div className="provider-benefits"><span><Zap size={16} /> Steady job leads</span><span><Clock3 size={16} /> Flexible schedule</span><span><ShieldCheck size={16} /> Fast, secure payouts</span></div><a className="button button-white" href="#get-app">Join as a provider <ArrowRight size={16} /></a></div></div></div></section>

      <section className="section reviews-section"><div className="wrap"><div className="section-heading centered"><span className="eyebrow blue-eyebrow">KIND WORDS, GOOD WORK</span><h2>Trusted around <em>Lagos.</em></h2><p>See why your neighbours keep coming back.</p></div><div className="reviews-grid">{testimonials.map(({ quote, name, area, initials }) => <article className="review-card" key={name}><div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div><p className="review-quote">“{quote}”</p><div className="review-person"><span className="review-avatar">{initials}</span><span><b>{name}</b><small>{area}</small></span><BadgeCheck size={17} /></div></article>)}</div></div></section>

      <section className="cta-section" id="get-app"><div className="wrap cta-grid"><div className="cta-copy"><span className="eyebrow cta-eyebrow">YOUR NEXT GREAT SERVICE IS ONE TAP AWAY</span><h2>Ready to get it <em>done?</em></h2><p>Get ServiceConnect and find a trusted expert for your next job. We’ll send a download link to your phone.</p><div className="store-buttons"><a href="https://apps.apple.com/" className="store-button"><span className="store-glyph">●</span><span><small>Download on the</small><b>App Store</b></span></a><a href="https://play.google.com/store" className="store-button"><span className="play-glyph">▶</span><span><small>GET IT ON</small><b>Google Play</b></span></a></div></div><form className="sms-card" onSubmit={sendLink}><label htmlFor="phone">Text me the download link</label><div className="sms-control"><span className="country-code">+234</span><input id="phone" type="tel" inputMode="tel" placeholder="Your phone number" value={phone} onChange={(e) => { setPhone(e.target.value); setSent(false) }} required /><button aria-label="Send download link"><ArrowRight size={19} /></button></div><p className="sms-status" role="status">{sent ? 'Thanks! Your download link is on its way.' : 'We’ll only use your number to send this link.'}</p></form></div></section>
    </main>

    <footer className="footer"><div className="wrap"><div className="footer-grid"><div className="footer-brand-col"><Logo footer /><p>Connecting you to trusted service experts. Your home, taken care of.</p><span className="footer-location"><MapPin size={15} /> Lagos, Nigeria</span></div><div><b className="footer-title">Explore</b><a href="#how-it-works">How it works</a><a href="#services">Our services</a><a href="#get-app">Get the app</a></div><div><b className="footer-title">For professionals</b><a href="#providers">Join as a provider</a><a href="#providers">Provider benefits</a><a href="mailto:hello@serviceconnect.ng">Help & support</a></div><div><b className="footer-title">Follow along</b><div className="social-links"><a href="https://instagram.com" aria-label="Instagram"><Instagram size={18} /></a><a href="https://facebook.com" aria-label="Facebook"><Facebook size={18} /></a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ServiceConnect. All rights reserved.</span><span><a href="#home">Privacy</a><a href="#home">Terms</a></span><span className="footer-tagline">Connecting You To Trusted Service Experts</span></div></div></footer>
  </div>
}

export default App

