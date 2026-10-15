import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check,
  ChevronDown, ChevronRight, Clock3, Droplets, Facebook, Hammer,
  Instagram, MapPin, MapPinned, Menu, MessageCircle, Paintbrush, PlugZap, Search, Send, ShieldCheck,
  Sparkles, Star, Wind, X, Wrench, CarFront, Scissors, Zap, Crosshair,
  Hospital, Pill, CircleGauge, Compass, GraduationCap, UserRound,
  ChefHat, Baby, Truck, Laptop, Music2,
} from 'lucide-react'


const countryCodes = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ')
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const countries = countryCodes.map((code) => ({ code, name: regionNames.of(code) })).sort((a, b) => a.name.localeCompare(b.name))

const services = [
  { name: 'Plumbing', detail: 'Pipes, taps & leaks', category: 'Home', icon: Droplets },
  { name: 'Electrical', detail: 'Wiring, lights & power', category: 'Home', icon: PlugZap },
  { name: 'Cleaning', detail: 'A fresh start at home', category: 'Home', icon: Sparkles },
  { name: 'Maid', detail: 'Reliable household help', category: 'Home', icon: Sparkles },
  { name: 'Cook', detail: 'Home cooking and meal prep', category: 'Home', icon: ChefHat },
  { name: 'AC Repair', detail: 'Cool air, made easy', category: 'Home', icon: Wind },
  { name: 'Carpenter & Carpentry', detail: 'Furniture, fittings & repairs', category: 'Home', icon: Hammer },
  { name: 'Painter & Painting', detail: 'Give your space new life', category: 'Home', icon: Paintbrush },
  { name: 'Mechanic', detail: 'Mobile auto care', category: 'Auto', icon: CarFront },
  { name: 'Tyre Puncture Help', detail: 'Roadside tyre repair', category: 'Auto', icon: CircleGauge },
  { name: 'Car Wash', detail: 'Mobile and local car cleaning', category: 'Auto', icon: CarFront },
  { name: 'Beauty & Salon', detail: 'Care that comes to you', category: 'Personal care', icon: Scissors },
  { name: 'Barber', detail: 'Cuts and grooming near you', category: 'Personal care', icon: UserRound },
  { name: 'Tailor', detail: 'Alterations and custom clothing', category: 'Personal care', icon: Scissors },
  { name: 'Babysitter', detail: 'Childcare support for your family', category: 'Personal care', icon: Baby },
  { name: 'Clinics & Medical Care', detail: 'Find nearby clinics', category: 'Health', icon: Hospital, directory: true },
  { name: 'Chemist & Pharmacy', detail: 'Find nearby pharmacies', category: 'Health', icon: Pill, directory: true },
  { name: 'Tourist Guide', detail: 'Local guides and experiences', category: 'Education & travel', icon: Compass },
  { name: 'Tutoring', detail: 'One-to-one learning support', category: 'Education & travel', icon: GraduationCap },
  { name: 'Packers & Movers', detail: 'Home and office moving help', category: 'Home', icon: Truck },
  { name: 'Computer Repair', detail: 'Computer setup and repairs', category: 'Tech & events', icon: Laptop },
  { name: 'DJ & Sound System', detail: 'Music and event sound setup', category: 'Tech & events', icon: Music2 },
]

const testimonials = [
  { quote: 'My plumber arrived on time, explained the fix clearly, and the price was exactly what I was quoted. That kind of peace of mind is priceless.', name: 'Amaka Okafor', area: 'Lagos, Nigeria', initials: 'AO' },
  { quote: 'Booking an electrician took less than five minutes. I could compare ratings first, and the whole process felt safe and simple.', name: 'Tunde Adeyemi', area: 'Lagos, Nigeria', initials: 'TA' },
  { quote: 'As a service provider, I have found great customers and grown my business. I get to choose my schedule and manage jobs from my phone.', name: 'Chika Nwosu', area: 'Service provider', initials: 'CN' },
]

const nav = [
  ['How it works', 'how-it-works'],
  ['Services', 'services'],
  ['Find us', 'map'],
  ['For providers', 'providers'],
]

function Logo({ footer = false }) {
  return <a className={`brand${footer ? ' brand-footer' : ''}`} href="#home" aria-label="ServiceConnect home">
    <span className="brand-mark"><Wrench size={21} strokeWidth={2.6} /></span>
    <span>Service<span>Connect</span></span>
  </a>
}

function PhonePreview({ countryName, city }) {
  return <div className="phone-scene" aria-label="Preview of the ServiceConnect mobile app">
    <div className="phone-glow" />
    <div className="phone-frame">
      <div className="phone-screen">
        <div className="phone-status"><span>9:41</span><span>● ● ●</span></div>
        <div className="phone-notch" />
        <div className="phone-content">
          <div className="phone-top"><div><small>Good morning, Amaka</small><strong>What do you need?</strong></div><span className="avatar-small">A</span></div>
          <div className="phone-location"><MapPin size={13} /> {city || countryName} <ChevronDown size={13} /></div>
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
    <div className="float-note note-bottom"><span className="mini-faces"><i>AO</i><i>TA</i><i>CN</i></span><span><b>4.8 out of 5</b><small>Service experts nearby</small></span></div>
  </div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [countryCode, setCountryCode] = useState('NG')
  const [city, setCity] = useState('')
  const [deviceLocation, setDeviceLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState('All services')
  const [dialog, setDialog] = useState(null)
  const [dialogStatus, setDialogStatus] = useState('')
  const [sessionRequests, setSessionRequests] = useState([])
  const [sessionProviderInterest, setSessionProviderInterest] = useState([])
  const [chatMessages, setChatMessages] = useState([{ id: 'welcome', sender: 'assistant', text: 'Hi! I’m the ServiceConnect chat preview. Ask how to find a service or set your location.' }])

  useEffect(() => {
    if (!dialog) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setDialog(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [dialog])

  const selectedCountry = countries.find(({ code }) => code === countryCode) || countries[0]

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return services.filter((service) => {
      const matchesCategory = activeFilter === 'All services' || service.category === activeFilter
      const matchesQuery = !normalized || `${service.name} ${service.detail}`.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [activeFilter, query])

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const openDialog = (type, service = '') => {
    setDialogStatus('')
    setDialog({ type, service })
    setMenuOpen(false)
  }

  const serviceMapUrl = (service) => {
    const nearby = deviceLocation
      ? `${deviceLocation.lat},${deviceLocation.lng}`
      : `${city ? `${city}, ` : ''}${selectedCountry.name}`
    const place = service === 'Clinics & Medical Care' ? 'clinics' : 'pharmacies'
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} near ${nearby}`)}`
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Your browser does not support location sharing. Choose a city instead.')
      return
    }
    setLocating(true)
    setLocationMessage('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setDeviceLocation({ lat: coords.latitude, lng: coords.longitude })
        setLocating(false)
        setLocationMessage('Your map is centered on your current location. Your coordinates are not saved.')
      },
      (error) => {
        setLocating(false)
        setLocationMessage(error.code === error.PERMISSION_DENIED
          ? 'Location access was declined. You can still enter a city or area.'
          : 'We could not read your location. Try entering a city or area instead.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  const mapQuery = deviceLocation
    ? `${deviceLocation.lat},${deviceLocation.lng}`
    : `${city ? `${city}, ` : ''}${selectedCountry.name}`

  const submitChatMessage = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const message = new FormData(form).get('message')?.toString().trim()
    if (!message) return
    const reply = 'Thanks for reaching out. This preview cannot connect you to a live agent or provider yet. Choose your country and city above to prepare a local service request.'
    setChatMessages((current) => [...current, { id: `you-${Date.now()}`, sender: 'user', text: message }, { id: `reply-${Date.now()}`, sender: 'assistant', text: reply }])
    form.reset()
  }

  const submitBooking = (event) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const request = {
      id: `SC-${Date.now().toString(36).toUpperCase()}`,
      service: dialog?.service,
      name: values.get('name'),
      phone: values.get('phone'),
      area: values.get('area'),
      country: values.get('country'),
      details: values.get('details'),
    }
    setSessionRequests((current) => [request, ...current])
    setDialogStatus(`Request ${request.id} is saved in this browser tab. No professional has been contacted.`)
    event.currentTarget.reset()
  }

  const submitProviderInterest = (event) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const interest = { name: values.get('name'), trade: values.get('trade'), area: values.get('area'), country: values.get('country') }
    setSessionProviderInterest((current) => [interest, ...current])
    setDialogStatus('Your provider interest is saved for this browser session only. It has not been sent to ServiceConnect.')
    event.currentTarget.reset()
  }

  return <div className="site-shell" id="home">
    <header className="site-header">
      <nav className="nav wrap" aria-label="Main navigation">
        <Logo />
        <div className="nav-links">{nav.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}</div>
        <div className="nav-actions"><button className="button button-outline button-small" onClick={() => openDialog('auth-login')}>Log in</button><button className="button button-primary button-small" onClick={() => openDialog('auth-signup')}>Sign up</button><button className="button button-outline button-small" onClick={() => openDialog('requests')}>My requests</button><button className="button button-primary button-small" onClick={() => openDialog('app')}>Get the app <ArrowUpRight size={15} /></button></div>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </nav>
      {menuOpen && <div className="mobile-menu">{nav.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}<button className="button button-outline" onClick={() => openDialog('auth-login')}>Log in</button><button className="button button-primary" onClick={() => openDialog('auth-signup')}>Sign up</button><button className="button button-outline" onClick={() => openDialog('requests')}>My requests</button><button className="button button-primary" onClick={() => openDialog('app')}>Get the app <ArrowRight size={16} /></button></div>}
    </header>

    <main>
      <section className="hero" id="home-hero"><div className="wrap hero-grid">
        <div className="hero-copy fade-in"><div className="eyebrow"><span className="live-dot" /> LOCAL SERVICES, WHEREVER YOU ARE</div>
          <h1>Trusted help for your home, <em>right around you.</em></h1>
          <p className="hero-lede">Find everyday service experts anywhere in the world. Choose your country and city to personalize a service request. Provider matching and booking launch city by city.</p>
          <form className="search-box" onSubmit={(e) => { e.preventDefault(); goTo('services') }}><Search size={19} /><input aria-label="Search for a service" placeholder="What service do you need today?" value={query} onChange={(e) => setQuery(e.target.value)} /><span className="search-divider" /><button type="submit" aria-label="Search services"><ArrowRight size={18} /></button></form>
          <div className="location-picker"><label><MapPin size={16} /><span className="sr-only">Country</span><select aria-label="Choose your country" value={countryCode} onChange={(event) => { setCountryCode(event.target.value); setDeviceLocation(null); setLocationMessage('') }}>{countries.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}</select><ChevronDown size={14} /></label><span className="location-divider"/><input aria-label="City or area" placeholder="City or area (optional)" value={city} onChange={(event) => { setCity(event.target.value); setDeviceLocation(null); setLocationMessage('') }} /><button type="button" className="use-location" onClick={useMyLocation} disabled={locating}><Crosshair size={15} />{locating ? 'Locating…' : 'Use my location'}</button></div>
          <p className="location-note" role="status">{locationMessage || 'Explore the site from anywhere. Service availability depends on local launch.'}</p>
          <div className="hero-buttons"><button className="button button-primary" onClick={() => goTo('services')}>Find a service <ArrowRight size={17} /></button><button className="button button-plain" onClick={() => openDialog('provider')}>Become a provider <ArrowUpRight size={16} /></button></div>
          <div className="hero-proof"><div className="proof-avatars"><i>AO</i><i>TA</i><i>CN</i><i>+</i></div><div><span className="stars">★★★★★</span><p><b>Discover local pros</b> in your community</p></div></div>
        </div>
        <div className="hero-art"><PhonePreview countryName={selectedCountry.name} city={city} /></div>
      </div></section>

      <section className="trust-strip"><div className="wrap trust-grid">{[['5,000+', 'Verified professionals'], ['15,000+', 'Happy customers'], ['4.8/5', 'Average rating'], ['98%', 'Jobs completed']].map(([num, label]) => <div className="trust-item" key={label}><strong>{num}</strong><span>{label}</span></div>)}</div></section>

      <section className="section how-section" id="how-it-works"><div className="wrap"><div className="section-heading centered"><span className="eyebrow blue-eyebrow">HOW IT WORKS</span><h2>Getting it done is <em>easy.</em></h2><p>From your first search to the finishing touch, we’ve got you.</p></div><div className="steps-grid">{[
        { n: '01', title: 'Choose a service', text: 'Search or filter the categories to find the kind of help you need.', icon: Search },
        { n: '02', title: 'Prepare a request', text: 'Add your contact and job details in the request form.', icon: BadgeCheck },
        { n: '03', title: 'Connect the marketplace', text: 'A provider matching and booking backend is required before a pro can be contacted.', icon: Check },
      ].map(({ n, title, text, icon: Icon }) => <article className="step-card" key={n}><div className="step-top"><span className="step-icon"><Icon size={23} /></span><span className="step-num">{n}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="section services-section" id="services"><div className="wrap"><div className="section-heading services-heading"><div><span className="eyebrow blue-eyebrow">HELP FOR EVERYDAY LIFE</span><h2>Meet your next <em>go-to pro.</em></h2></div><p>Find help for your home, vehicle, personal care, learning, travel, and local health directories.</p></div><div className="service-toolbar"><div className="filter-pills">{['All services', 'Home', 'Auto', 'Personal care', 'Health', 'Education & travel', 'Tech & events'].map((filter) => <button type="button" className={activeFilter === filter ? 'filter-pill selected' : 'filter-pill'} key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><span className="service-count">{filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} <ArrowDown size={14} /></span></div><div className="services-grid">{filteredServices.map(({ name, detail, icon: Icon, directory }) => <button type="button" className="service-card" key={name} onClick={() => directory ? window.open(serviceMapUrl(name), '_blank', 'noopener,noreferrer') : openDialog('booking', name)}><span className="service-icon"><Icon size={24} /></span><span className="service-card-text"><b>{name}</b><small>{directory ? 'Search nearby places in Maps' : detail}</small></span><ChevronRight className="service-arrow" size={18} /></button>)}</div>{filteredServices.length === 0 && <div className="empty-state">No services match “{query}”. Try another search.</div>}<div className="service-footnote"><ShieldCheck size={17} /> Requests stay in this browser session; nearby clinic and pharmacy searches open Google Maps.</div></div></section>

      <section className="section why-section" id="providers"><div className="wrap why-grid"><div className="why-copy"><span className="eyebrow blue-eyebrow">TRUST BY DESIGN</span><h2>Good people.<br /><em>Great work.</em></h2><p>Identity checks, secure checkout, and service guarantees are planned marketplace features. They require the provider and payment systems to be connected before they can be offered.</p><button type="button" onClick={() => goTo('how-it-works')} className="text-link">See how it works <ArrowRight size={16} /></button><div className="why-points">{[['Identity checks', 'Provider verification needs a live onboarding service.'], ['Secure payments', 'Payment processing has not been configured.'], ['Service support', 'Support contact details still need to be added.']].map(([t, d]) => <div className="why-point" key={t}><span><Check size={14} /></span><p><b>{t}</b><small>{d}</small></p></div>)}</div></div><div className="provider-card"><div className="provider-orbit orbit-one"/><div className="provider-orbit orbit-two"/><div className="provider-card-content"><span className="provider-icon"><Wrench size={24} /></span><span className="provider-label">FOR SERVICE PROFESSIONALS</span><h3>Want to join<br />the network?</h3><p>Register your interest in this preview. Your details stay in this browser tab and are not sent anywhere.</p><div className="provider-benefits"><span><Zap size={16} /> Job leads planned</span><span><Clock3 size={16} /> Flexible schedule</span><span><ShieldCheck size={16} /> Secure payouts planned</span></div><button type="button" className="button button-white" onClick={() => openDialog('provider')}>Register interest <ArrowRight size={16} /></button></div></div></div></section>

      <section className="section map-section" id="map"><div className="wrap map-grid"><div className="map-copy"><span className="eyebrow blue-eyebrow">LOCAL DISCOVERY</span><h2>Find services near <em>you.</em></h2><p>Explore the location you selected above. When ServiceConnect launches in your area, local pros can join the network.</p><div className="map-location"><span><MapPinned size={19} /></span><div><small>{deviceLocation ? 'Current device location' : 'Selected location'}</small><strong>{deviceLocation ? 'Near your location' : `${city ? `${city}, ` : ''}${selectedCountry.name}`}</strong></div></div><a className="button button-primary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={16} /></a></div><div className="map-frame"><iframe title={`Map of ${deviceLocation ? 'your current location' : mapQuery}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><span className="map-caption"><MapPin size={15} /> {deviceLocation ? 'Your current location' : `${city ? `${city}, ` : ''}${selectedCountry.name}`}</span></div></div></section>

      <section className="section reviews-section"><div className="wrap"><div className="section-heading centered"><span className="eyebrow blue-eyebrow">KIND WORDS, GOOD WORK</span><h2>Trusted service, wherever <em>you are.</em></h2><p>See why your neighbours keep coming back.</p></div><div className="reviews-grid">{testimonials.map(({ quote, name, area, initials }) => <article className="review-card" key={name}><div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div><p className="review-quote">“{quote}”</p><div className="review-person"><span className="review-avatar">{initials}</span><span><b>{name}</b><small>{area}</small></span><BadgeCheck size={17} /></div></article>)}</div></div></section>

      <section className="cta-section" id="get-app"><div className="wrap cta-grid"><div className="cta-copy"><span className="eyebrow cta-eyebrow">YOUR NEXT GREAT SERVICE IS ONE TAP AWAY</span><h2>Ready to get it <em>done?</em></h2><p>ServiceConnect mobile apps are not published yet. Start by choosing a service on this page.</p><div className="store-buttons"><button type="button" className="store-button store-unavailable" disabled><span className="store-glyph">●</span><span><small>App download</small><b>App Store — coming soon</b></span></button><button type="button" className="store-button store-unavailable" disabled><span className="play-glyph">▶</span><span><small>App download</small><b>Google Play — coming soon</b></span></button></div></div><div className="sms-card cta-note"><span className="cta-note-icon"><ShieldCheck size={21} /></span><h3>Start with a service request</h3><p>Choose one of the service cards above to open a request form. Requests stay in this browser session until a booking service is connected.</p><button type="button" className="button button-white" onClick={() => goTo('services')}>Browse services <ArrowRight size={16} /></button></div></div></section>
    </main>

    <button className="chat-launcher" type="button" onClick={() => openDialog('chat')} aria-label="Open ServiceConnect chat"><MessageCircle size={20} /><span>Chat with us</span></button>

    <footer className="footer"><div className="wrap"><div className="footer-grid"><div className="footer-brand-col"><Logo footer /><p>Connecting you to trusted service experts. Your home, taken care of.</p><span className="footer-location"><MapPin size={15} /> {city ? `${city}, ` : ''}{selectedCountry.name}</span></div><div><b className="footer-title">Explore</b><a href="#how-it-works">How it works</a><a href="#services">Our services</a><a href="#map">Find us</a><a href="#get-app">Get the app</a></div><div><b className="footer-title">For professionals</b><button className="footer-link-button" onClick={() => openDialog('provider')}>Join as a provider</button><a href="#providers">Provider benefits</a><button className="footer-link-button" onClick={() => openDialog('support')}>Help & support</button></div><div><b className="footer-title">Follow along</b><div className="social-links"><button onClick={() => openDialog('social')} aria-label="Instagram"><Instagram size={18} /></button><button onClick={() => openDialog('social')} aria-label="Facebook"><Facebook size={18} /></button></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ServiceConnect. All rights reserved.</span><span><button onClick={() => openDialog('privacy')}>Privacy</button><button onClick={() => openDialog('terms')}>Terms</button></span><span className="footer-tagline">Connecting You To Trusted Service Experts</span></div></div></footer>

    {dialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}><section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="dialog-close" type="button" onClick={() => setDialog(null)} aria-label="Close dialog"><X size={19} /></button>
      {dialog.type === 'booking' && <><span className="dialog-eyebrow">SERVICE REQUEST</span><h2 id="dialog-title">Request {dialog.service}</h2>{dialogStatus ? <div className="dialog-success" role="status"><BadgeCheck size={25} /><p>{dialogStatus}</p><button className="button button-primary" onClick={() => setDialog(null)}>Done</button></div> : <><p className="dialog-copy">Tell us a little about the job. This demo keeps your request in the current tab and does not contact a provider.</p><form className="dialog-form" onSubmit={submitBooking}><label>Your name<input name="name" autoComplete="name" required /></label><label>Phone number<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Include your country code" required /></label><label>Country<select name="country" defaultValue={countryCode} required>{countries.map(({ code, name }) => <option key={code} value={name}>{name}</option>)}</select></label><label>City or neighbourhood<input name="area" defaultValue={city} placeholder="Enter your city or area" required /></label><label>What needs to be done?<textarea name="details" rows="3" placeholder="Add useful details" required /></label><button className="button button-primary" type="submit">Save request <ArrowRight size={16} /></button></form></>}</>}
      {dialog.type === 'provider' && <><span className="dialog-eyebrow">PROVIDER INTEREST</span><h2 id="dialog-title">Join ServiceConnect</h2>{dialogStatus ? <div className="dialog-success" role="status"><BadgeCheck size={25} /><p>{dialogStatus}</p><button className="button button-primary" onClick={() => setDialog(null)}>Done</button></div> : <><p className="dialog-copy">Share your details to preview the provider onboarding flow. This demo does not send or store your information after the tab closes.</p><form className="dialog-form" onSubmit={submitProviderInterest}><label>Your name<input name="name" autoComplete="name" required /></label><label>Service you provide<select name="trade" defaultValue="" required><option value="" disabled>Select a service</option>{services.map(({name}) => <option key={name}>{name}</option>)}</select></label><label>Country<select name="country" defaultValue={countryCode} required>{countries.map(({ code, name }) => <option key={code} value={name}>{name}</option>)}</select></label><label>City or service area<input name="area" defaultValue={city} placeholder="Enter your city or area" required /></label><button className="button button-primary" type="submit">Continue <ArrowRight size={16} /></button></form></>}</>}
      {['auth-login', 'auth-signup'].includes(dialog.type) && <><span className="dialog-eyebrow">{dialog.type === 'auth-login' ? 'WELCOME BACK' : 'GET STARTED'}</span><h2 id="dialog-title">{dialog.type === 'auth-login' ? 'Log in to ServiceConnect' : 'Create your account'}</h2>{dialogStatus ? <div className="dialog-success" role="status"><ShieldCheck size={25} /><p>{dialogStatus}</p><button className="button button-primary" onClick={() => setDialog(null)}>Got it</button></div> : <><p className="dialog-copy">{dialog.type === 'auth-login' ? 'Enter your details to preview the login form.' : 'Create your customer account to preview sign up.'} Authentication is not connected yet, so this form will not create or access an account.</p><form className="dialog-form" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; if (dialog.type === 'auth-signup' && form.elements.password.value !== form.elements.confirmPassword.value) { form.elements.confirmPassword.setCustomValidity('Passwords do not match.'); form.reportValidity(); return } setDialogStatus('Authentication is not configured yet. No account was created and no login was performed.') }}>
        {dialog.type === 'auth-signup' && <label>Your name<input name="name" autoComplete="name" required /></label>}
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label>Password<input name="password" type="password" autoComplete={dialog.type === 'auth-login' ? 'current-password' : 'new-password'} minLength="8" required /></label>
        {dialog.type === 'auth-signup' && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength="8" onInput={(event) => event.currentTarget.setCustomValidity('')} required /></label>}
        <button className="button button-primary" type="submit">{dialog.type === 'auth-login' ? 'Log in' : 'Sign up'} <ArrowRight size={16} /></button>
      </form><p className="auth-switch">{dialog.type === 'auth-login' ? 'New to ServiceConnect?' : 'Already have an account?'} <button type="button" onClick={() => openDialog(dialog.type === 'auth-login' ? 'auth-signup' : 'auth-login')}>{dialog.type === 'auth-login' ? 'Sign up' : 'Log in'}</button></p></>}</>}
      {dialog.type === 'requests' && <><span className="dialog-eyebrow">THIS BROWSER SESSION</span><h2 id="dialog-title">My requests</h2>{sessionRequests.length || sessionProviderInterest.length ? <div className="request-list">{sessionRequests.map((request) => <article className="request-item" key={request.id}><b>{request.service} request</b><span>{request.id} · {request.area}, {request.country}</span><small>Saved in this tab · No provider contacted</small></article>)}{sessionProviderInterest.map((interest, index) => <article className="request-item" key={`${interest.name}-${index}`}><b>Provider interest · {interest.trade}</b><span>{interest.name} · {interest.area}, {interest.country}</span><small>Saved in this tab · Not sent to ServiceConnect</small></article>)}</div> : <p className="dialog-copy">You have no requests in this browser tab. Choose a service card or provider option to start one.</p>}<button className="button button-primary" onClick={() => { setDialog(null); goTo('services') }}>Browse services <ArrowRight size={16} /></button></>}
      {dialog.type === 'chat' && <><span className="dialog-eyebrow">SERVICECONNECT CHAT</span><h2 id="dialog-title">How can we help?</h2><p className="dialog-copy">Chat preview: messages stay in this browser session and are not sent to a live agent.</p><div className="chat-transcript" aria-live="polite">{chatMessages.map(({ id, sender, text }) => <div className={`chat-message ${sender === 'user' ? 'chat-message-user' : ''}`} key={id}><small>{sender === 'user' ? 'You' : 'ServiceConnect'}</small><p>{text}</p></div>)}</div><form className="chat-form" onSubmit={submitChatMessage}><label className="sr-only" htmlFor="chat-message-input">Your message</label><input id="chat-message-input" name="message" autoComplete="off" placeholder="Write a message…" maxLength="500" required /><button className="button button-primary" type="submit" aria-label="Send message"><Send size={17} /></button></form></>}
      {dialog.type === 'app' && <><span className="dialog-eyebrow">APP STATUS</span><h2 id="dialog-title">Mobile app coming soon</h2><p className="dialog-copy">The App Store and Google Play apps are not published yet. You can browse services and preview the request form on this website.</p><button className="button button-primary" onClick={() => { setDialog(null); goTo('services') }}>Browse services <ArrowRight size={16} /></button></>}
      {['support', 'social'].includes(dialog.type) && <><span className="dialog-eyebrow">SERVICECONNECT</span><h2 id="dialog-title">{dialog.type === 'support' ? 'Support contact coming soon' : 'Social links coming soon'}</h2><p className="dialog-copy">These contact channels have not been configured yet. No message has been sent.</p><button className="button button-primary" onClick={() => setDialog(null)}>Close</button></>}
      {['privacy', 'terms'].includes(dialog.type) && <><span className="dialog-eyebrow">{dialog.type === 'privacy' ? 'PRIVACY' : 'TERMS'}</span><h2 id="dialog-title">{dialog.type === 'privacy' ? 'Demo privacy notice' : 'Demo site terms'}</h2><p className="dialog-copy">{dialog.type === 'privacy' ? 'This demo does not send form details to a server. Service request details remain in page memory for this open tab and are cleared when you leave or refresh.' : 'This page is a product demo. Requests created here are not sent to professionals, no bookings or payments are made, and service availability is not guaranteed.'}</p><button className="button button-primary" onClick={() => setDialog(null)}>Close</button></>}
    </section></div>}
  </div>
}

export default App

