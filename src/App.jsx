import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check,
  ChevronDown, ChevronRight, Clock3, Droplets, Facebook, Hammer,
  Instagram, MapPin, MapPinned, Menu, MessageCircle, Paintbrush, PlugZap, Search, Send, ShieldCheck,
  Sparkles, Star, Wind, X, Wrench, CarFront, Scissors, Zap, Crosshair,
  Hospital, Pill, CircleGauge, Compass, GraduationCap, UserRound, Bell,
  ChefHat, Baby, Truck, Laptop, Music2, CalendarDays, Camera, Video, PackageCheck,
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
  { name: 'Event Planner', detail: 'Plan celebrations and events', category: 'Tech & events', icon: CalendarDays },
  { name: 'Photographer', detail: 'Portraits and event photography', category: 'Tech & events', icon: Camera },
  { name: 'Videographer', detail: 'Event films and video coverage', category: 'Tech & events', icon: Video },
  { name: 'Courier Delivery', detail: 'Send packages across your area', category: 'Delivery & logistics', icon: PackageCheck },
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

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: { ...(options.body ? { 'content-type': 'application/json' } : {}), ...(options.headers || {}) },
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'The request could not be completed.')
  return data
}

function filePayload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => resolve({ name: file.name, type: file.type, data: String(reader.result).split(',')[1] || '' })
    reader.readAsDataURL(file)
  })
}

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
  const [currentUser, setCurrentUser] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [profileNotice, setProfileNotice] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [documentFile, setDocumentFile] = useState(null)
  const [sessionProviderInterest, setSessionProviderInterest] = useState([])
  const [chatMessages, setChatMessages] = useState([{ id: 'welcome', sender: 'assistant', text: 'Hi! I’m the ServiceConnect messenger demo. Messages receive automated replies; a live agent is not connected.' }])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([{ id: 'welcome', title: 'Welcome to ServiceConnect', message: 'Your on-site updates will appear here.', time: 'Just now', read: false }])

  useEffect(() => {
    let active = true
    api('/api/auth/me').then(({ user }) => {
      if (!active) return
      setCurrentUser(user)
      if (user) loadAccountData()
    }).catch(() => {})
    return () => { active = false }
  }, [])

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

  const openProfile = async () => {
    if (!currentUser) { openDialog('auth-login'); return }
    setProfileNotice('')
    setAvatarFile(null)
    setDocumentFile(null)
    await loadProfile()
    setDialogStatus('')
    setDialog({ type: 'profile' })
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

  const createNotification = (title, message) => {
    setNotifications((current) => [{ id: `notice-${Date.now()}`, title, message, time: 'Just now', read: false }, ...current].slice(0, 8))
  }

  const submitChatMessage = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const message = new FormData(form).get('message')?.toString().trim()
    if (!message) return
    try {
      const { reply } = await api('/api/chat', { method: 'POST', body: { message } })
      setChatMessages((current) => [...current, { id: `you-${Date.now()}`, sender: 'user', text: message }, { id: `reply-${Date.now()}`, sender: 'assistant', text: reply }])
      createNotification('Messenger reply', 'Your message received an automated demo reply.')
      form.reset()
    } catch (error) { setDialogStatus(error.message) }
  }

  const loadAccountData = async () => {
    try {
      const data = await api('/api/requests')
      setSessionRequests(data.requests || [])
      setSessionProviderInterest(data.providerInterests || [])
    } catch { setSessionRequests([]); setSessionProviderInterest([]) }
  }

  const loadProfile = async () => {
    try {
      const data = await api('/api/profile')
      setProfileData(data.profile)
      setProfileDocuments(data.documents || [])
    } catch (error) { setProfileNotice(error.message) }
  }

  const [profileDocuments, setProfileDocuments] = useState([])

  const saveProfile = async (event) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    try {
      const data = await api('/api/profile', { method: 'PUT', body: {
        name: values.get('name'), phone: values.get('phone'), area: values.get('area'), bio: values.get('bio'),
      } })
      setProfileData((current) => ({ ...current, ...data.profile }))
      setCurrentUser((current) => current ? { ...current, name: data.profile.name } : current)
      setProfileNotice('Profile details saved.')
    } catch (error) { setProfileNotice(error.message) }
  }

  const uploadAvatar = async () => {
    if (!avatarFile) { setProfileNotice('Choose a picture first.'); return }
    try {
      await api('/api/profile/avatar', { method: 'POST', body: await filePayload(avatarFile) })
      setProfileData((current) => ({ ...current, hasAvatar: true }))
      setAvatarFile(null)
      setProfileNotice('Profile picture uploaded.')
    } catch (error) { setProfileNotice(error.message) }
  }

  const uploadProfileDocument = async (event) => {
    event.preventDefault()
    if (!documentFile) { setProfileNotice('Choose a document first.'); return }
    try {
      const payload = await filePayload(documentFile)
      const { document } = await api('/api/profile/documents', { method: 'POST', body: payload })
      setProfileDocuments((current) => [document, ...current])
      setDocumentFile(null)
      event.currentTarget.reset()
      setProfileNotice('Private document uploaded.')
    } catch (error) { setProfileNotice(error.message) }
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const signup = dialog.type === 'auth-signup'
    if (signup && values.get('password') !== values.get('confirmPassword')) {
      form.elements.confirmPassword.setCustomValidity('Passwords do not match.')
      form.reportValidity()
      return
    }
    try {
      const data = await api(signup ? '/api/auth/signup' : '/api/auth/login', {
        method: 'POST',
        body: { name: values.get('name'), email: values.get('email'), password: values.get('password') },
      })
      setCurrentUser(data.user)
      await loadAccountData()
      setDialogStatus(signup ? 'Your demo account is ready and you are signed in.' : 'You are now signed in.')
      createNotification(signup ? 'Account created' : 'Welcome back', data.user.email)
    } catch (error) { setDialogStatus(error.message) }
  }

  const logOut = async () => {
    try { await api('/api/auth/logout', { method: 'POST' }) } catch {}
    setCurrentUser(null)
    setSessionRequests([])
    setSessionProviderInterest([])
    setDialogStatus('You are signed out.')
    createNotification('Signed out', 'Your demo session has ended.')
  }

  const submitBooking = async (event) => {
    event.preventDefault()
    if (!currentUser) { setDialogStatus('Log in or create an account before saving a request. Your details have not been sent.'); return }
    const values = new FormData(event.currentTarget)
    try {
      const { request } = await api('/api/requests', { method: 'POST', body: {
        service: dialog?.service, phone: values.get('phone'), area: values.get('area'),
        country: values.get('country'), details: values.get('details'),
      } })
      await loadAccountData()
      createNotification('Service request saved', `${request.service} request ${request.id} was saved to your demo account.`)
      setDialogStatus(`Request ${request.id} is saved to your demo account. No professional has been contacted.`)
      event.currentTarget.reset()
    } catch (error) { setDialogStatus(error.message) }
  }

  const submitProviderInterest = async (event) => {
    event.preventDefault()
    if (!currentUser) { setDialogStatus('Log in or create an account before saving provider interest. Your details have not been sent.'); return }
    const values = new FormData(event.currentTarget)
    try {
      await api('/api/provider-interest', { method: 'POST', body: {
        trade: values.get('trade'), area: values.get('area'), country: values.get('country'),
      } })
      await loadAccountData()
      setDialogStatus('Your provider interest is saved to your demo account. The provider network is not yet active.')
      event.currentTarget.reset()
    } catch (error) { setDialogStatus(error.message) }
  }


  return <div className="site-shell" id="home">
    <header className="site-header">
      <nav className="nav wrap" aria-label="Main navigation">
        <Logo />
        <div className="nav-links">{nav.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}</div>
        <div className="nav-actions">{currentUser ? <><span className="signed-in-label">Hi, {currentUser.name}</span><button className="button button-outline button-small" onClick={logOut}>Log out</button></> : <><button className="button button-outline button-small" onClick={() => openDialog('auth-login')}>Log in</button><button className="button button-primary button-small" onClick={() => openDialog('auth-signup')}>Sign up</button></>}{currentUser && <button className="button button-outline button-small" onClick={openProfile}>My profile</button>}<button className="button button-outline button-small" onClick={() => openDialog('requests')}>My requests</button><button className="button button-primary button-small" onClick={() => openDialog('app')}>Get the app <ArrowUpRight size={15} /></button><div className="notification-wrap"><button className="notification-button" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(!notificationsOpen); if (!notificationsOpen) setNotifications((current) => current.map((item) => ({ ...item, read: true }))) }}><Bell size={19} />{notifications.some((item) => !item.read) && <span className="notification-dot" />}</button>{notificationsOpen && <div className="notification-panel" role="region" aria-label="Notifications"><div className="notification-heading"><strong>Notifications</strong><button type="button" onClick={() => setNotifications([])}>Clear</button></div>{notifications.length ? notifications.map((item) => <article className="notification-item" key={item.id}><span className="notification-icon"><Bell size={15} /></span><div><b>{item.title}</b><p>{item.message}</p><small>{item.time} · On this device</small></div></article>) : <p className="notification-empty">You’re all caught up.</p>}<p className="notification-note">Demo updates stay in this browser session.</p></div>}</div></div>
        <button className="mobile-notification-button" type="button" aria-label="Notifications" onClick={() => { setNotificationsOpen(!notificationsOpen); if (!notificationsOpen) setNotifications((current) => current.map((item) => ({ ...item, read: true }))) }}><Bell size={19} />{notifications.some((item) => !item.read) && <span className="notification-dot" />}</button>{notificationsOpen && <div className="notification-panel mobile-notification-panel" role="region" aria-label="Notifications"><div className="notification-heading"><strong>Notifications</strong><button type="button" onClick={() => setNotifications([])}>Clear</button></div>{notifications.length ? notifications.map((item) => <article className="notification-item" key={item.id}><span className="notification-icon"><Bell size={15} /></span><div><b>{item.title}</b><p>{item.message}</p><small>{item.time} · On this device</small></div></article>) : <p className="notification-empty">You’re all caught up.</p>}<p className="notification-note">Demo updates stay in this browser session.</p></div>}
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </nav>
      {menuOpen && <div className="mobile-menu">{nav.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}{currentUser ? <><button className="button button-outline" onClick={openProfile}>My profile</button><button className="button button-outline" onClick={logOut}>Log out</button></> : <><button className="button button-outline" onClick={() => openDialog('auth-login')}>Log in</button><button className="button button-primary" onClick={() => openDialog('auth-signup')}>Sign up</button></>}<button className="button button-outline" onClick={() => openDialog('requests')}>My requests</button><button className="button button-primary" onClick={() => openDialog('app')}>Get the app <ArrowRight size={16} /></button><button className="button button-outline" onClick={() => { setMenuOpen(false); setNotificationsOpen(true); setNotifications((current) => current.map((item) => ({ ...item, read: true }))) }}><Bell size={16} /> Notifications</button></div>}
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

      <section className="section services-section" id="services"><div className="wrap"><div className="section-heading services-heading"><div><span className="eyebrow blue-eyebrow">HELP FOR EVERYDAY LIFE</span><h2>Meet your next <em>go-to pro.</em></h2></div><p>Find help for your home, vehicle, personal care, learning, travel, and local health directories.</p></div><div className="service-toolbar"><div className="filter-pills">{['All services', 'Home', 'Auto', 'Personal care', 'Health', 'Education & travel', 'Tech & events', 'Delivery & logistics'].map((filter) => <button type="button" className={activeFilter === filter ? 'filter-pill selected' : 'filter-pill'} key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><span className="service-count">{filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} <ArrowDown size={14} /></span></div><div className="services-grid">{filteredServices.map(({ name, detail, icon: Icon, directory }) => <button type="button" className="service-card" key={name} onClick={() => directory ? window.open(serviceMapUrl(name), '_blank', 'noopener,noreferrer') : openDialog('booking', name)}><span className="service-icon"><Icon size={24} /></span><span className="service-card-text"><b>{name}</b><small>{directory ? 'Search nearby places in Maps' : detail}</small></span><ChevronRight className="service-arrow" size={18} /></button>)}</div>{filteredServices.length === 0 && <div className="empty-state">No services match “{query}”. Try another search.</div>}<div className="service-footnote"><ShieldCheck size={17} /> Requests stay in this browser session; nearby clinic and pharmacy searches open Google Maps.</div></div></section>

      <section className="section why-section" id="providers"><div className="wrap why-grid"><div className="why-copy"><span className="eyebrow blue-eyebrow">TRUST BY DESIGN</span><h2>Good people.<br /><em>Great work.</em></h2><p>Identity checks, secure checkout, and service guarantees are planned marketplace features. They require the provider and payment systems to be connected before they can be offered.</p><button type="button" onClick={() => goTo('how-it-works')} className="text-link">See how it works <ArrowRight size={16} /></button><div className="why-points">{[['Identity checks', 'Provider verification needs a live onboarding service.'], ['Secure payments', 'Payment processing has not been configured.'], ['Service support', 'Support contact details still need to be added.']].map(([t, d]) => <div className="why-point" key={t}><span><Check size={14} /></span><p><b>{t}</b><small>{d}</small></p></div>)}</div></div><div className="provider-card"><div className="provider-orbit orbit-one"/><div className="provider-orbit orbit-two"/><div className="provider-card-content"><span className="provider-icon"><Wrench size={24} /></span><span className="provider-label">FOR SERVICE PROFESSIONALS</span><h3>Want to join<br />the network?</h3><p>Register your interest in this preview. Your details stay in this browser tab and are not sent anywhere.</p><div className="provider-benefits"><span><Zap size={16} /> Job leads planned</span><span><Clock3 size={16} /> Flexible schedule</span><span><ShieldCheck size={16} /> Secure payouts planned</span></div><button type="button" className="button button-white" onClick={() => openDialog('provider')}>Register interest <ArrowRight size={16} /></button></div></div></div></section>

      <section className="section map-section" id="map"><div className="wrap map-grid"><div className="map-copy"><span className="eyebrow blue-eyebrow">LOCAL DISCOVERY</span><h2>Find services near <em>you.</em></h2><p>Explore the location you selected above. When ServiceConnect launches in your area, local pros can join the network.</p><div className="map-location"><span><MapPinned size={19} /></span><div><small>{deviceLocation ? 'Current device location' : 'Selected location'}</small><strong>{deviceLocation ? 'Near your location' : `${city ? `${city}, ` : ''}${selectedCountry.name}`}</strong></div></div><a className="button button-primary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={16} /></a></div><div className="map-frame"><iframe title={`Map of ${deviceLocation ? 'your current location' : mapQuery}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><span className="map-caption"><MapPin size={15} /> {deviceLocation ? 'Your current location' : `${city ? `${city}, ` : ''}${selectedCountry.name}`}</span></div></div></section>

      <section className="section reviews-section"><div className="wrap"><div className="section-heading centered"><span className="eyebrow blue-eyebrow">KIND WORDS, GOOD WORK</span><h2>Trusted service, wherever <em>you are.</em></h2><p>See why your neighbours keep coming back.</p></div><div className="reviews-grid">{testimonials.map(({ quote, name, area, initials }) => <article className="review-card" key={name}><div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div><p className="review-quote">“{quote}”</p><div className="review-person"><span className="review-avatar">{initials}</span><span><b>{name}</b><small>{area}</small></span><BadgeCheck size={17} /></div></article>)}</div></div></section>

      <section className="cta-section" id="get-app"><div className="wrap cta-grid"><div className="cta-copy"><span className="eyebrow cta-eyebrow">YOUR NEXT GREAT SERVICE IS ONE TAP AWAY</span><h2>Ready to get it <em>done?</em></h2><p>ServiceConnect mobile apps are not published yet. Start by choosing a service on this page.</p><div className="store-buttons"><button type="button" className="store-button store-unavailable" disabled><span className="store-glyph">●</span><span><small>App download</small><b>App Store — coming soon</b></span></button><button type="button" className="store-button store-unavailable" disabled><span className="play-glyph">▶</span><span><small>App download</small><b>Google Play — coming soon</b></span></button></div></div><div className="sms-card cta-note"><span className="cta-note-icon"><ShieldCheck size={21} /></span><h3>Start with a service request</h3><p>Choose one of the service cards above to open a request form. Requests stay in this browser session until a booking service is connected.</p><button type="button" className="button button-white" onClick={() => goTo('services')}>Browse services <ArrowRight size={16} /></button></div></div></section>
    </main>

    <button className="chat-launcher" type="button" onClick={() => openDialog('chat')} aria-label="Open ServiceConnect messenger"><MessageCircle size={20} /><span>Messenger</span></button>

    <footer className="footer"><div className="wrap"><div className="footer-grid"><div className="footer-brand-col"><Logo footer /><p>Connecting you to trusted service experts. Your home, taken care of.</p><span className="footer-location"><MapPin size={15} /> {city ? `${city}, ` : ''}{selectedCountry.name}</span></div><div><b className="footer-title">Explore</b><a href="#how-it-works">How it works</a><a href="#services">Our services</a><a href="#map">Find us</a><a href="#get-app">Get the app</a></div><div><b className="footer-title">For professionals</b><button className="footer-link-button" onClick={() => openDialog('provider')}>Join as a provider</button><a href="#providers">Provider benefits</a><button className="footer-link-button" onClick={() => openDialog('support')}>Help & support</button></div><div><b className="footer-title">Follow along</b><div className="social-links"><button onClick={() => openDialog('social')} aria-label="Instagram"><Instagram size={18} /></button><button onClick={() => openDialog('social')} aria-label="Facebook"><Facebook size={18} /></button></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ServiceConnect. All rights reserved.</span><span><button onClick={() => openDialog('privacy')}>Privacy</button><button onClick={() => openDialog('terms')}>Terms</button></span><span className="footer-tagline">Connecting You To Trusted Service Experts</span></div></div></footer>

    {dialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}><section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="dialog-close" type="button" onClick={() => setDialog(null)} aria-label="Close dialog"><X size={19} /></button>
      {dialog.type === 'booking' && <><span className="dialog-eyebrow">SERVICE REQUEST</span><h2 id="dialog-title">Request {dialog.service}</h2>{dialogStatus ? <div className="dialog-success" role="status"><BadgeCheck size={25} /><p>{dialogStatus}</p><button className="button button-primary" onClick={() => setDialog(null)}>Done</button></div> : <><p className="dialog-copy">Requests are saved to your demo account. No professional has been contacted.</p><form className="dialog-form" onSubmit={submitBooking}><label>Your name<input name="name" autoComplete="name" required /></label><label>Phone number<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Include your country code" required /></label><label>Country<select name="country" defaultValue={countryCode} required>{countries.map(({ code, name }) => <option key={code} value={name}>{name}</option>)}</select></label><label>City or neighbourhood<input name="area" defaultValue={city} placeholder="Enter your city or area" required /></label><label>What needs to be done?<textarea name="details" rows="3" placeholder="Add useful details" required /></label><button className="button button-primary" type="submit">Save request <ArrowRight size={16} /></button></form></>}</>}
      {dialog.type === 'provider' && <><span className="dialog-eyebrow">PROVIDER INTEREST</span><h2 id="dialog-title">Join ServiceConnect</h2>{dialogStatus ? <div className="dialog-success" role="status"><BadgeCheck size={25} /><p>{dialogStatus}</p><button className="button button-primary" onClick={() => setDialog(null)}>Done</button></div> : <><p className="dialog-copy">Save your provider interest to your demo account. The provider network is not yet active.</p><form className="dialog-form" onSubmit={submitProviderInterest}><label>Your name<input name="name" autoComplete="name" required /></label><label>Service you provide<select name="trade" defaultValue="" required><option value="" disabled>Select a service</option>{services.map(({name}) => <option key={name}>{name}</option>)}</select></label><label>Country<select name="country" defaultValue={countryCode} required>{countries.map(({ code, name }) => <option key={code} value={name}>{name}</option>)}</select></label><label>City or service area<input name="area" defaultValue={city} placeholder="Enter your city or area" required /></label><button className="button button-primary" type="submit">Continue <ArrowRight size={16} /></button></form></>}</>}
      {['auth-login', 'auth-signup'].includes(dialog.type) && <><span className="dialog-eyebrow">{dialog.type === 'auth-login' ? 'WELCOME BACK' : 'GET STARTED'}</span><h2 id="dialog-title">{dialog.type === 'auth-login' ? 'Log in to ServiceConnect' : 'Create your account'}</h2>{dialogStatus ? <div className="dialog-success" role="status"><ShieldCheck size={25} /><p>{dialogStatus}</p><button className="button button-primary" onClick={() => setDialog(null)}>Got it</button></div> : <><p className="dialog-copy">{dialog.type === 'auth-login' ? 'Sign in to access your saved demo requests.' : 'Create a demo account to save service requests and provider interest. Demo data may be cleared when the free service restarts or redeploys.'}</p><form className="dialog-form" onSubmit={submitAuth}>
        {dialog.type === 'auth-signup' && <label>Your name<input name="name" autoComplete="name" minLength="2" required /></label>}
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label>Password<input name="password" type="password" autoComplete={dialog.type === 'auth-login' ? 'current-password' : 'new-password'} minLength="8" required /></label>
        {dialog.type === 'auth-signup' && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength="8" onInput={(event) => event.currentTarget.setCustomValidity('')} required /></label>}
        <button className="button button-primary" type="submit">{dialog.type === 'auth-login' ? 'Log in' : 'Sign up'} <ArrowRight size={16} /></button>
      </form><p className="auth-switch">{dialog.type === 'auth-login' ? 'New to ServiceConnect?' : 'Already have an account?'} <button type="button" onClick={() => openDialog(dialog.type === 'auth-login' ? 'auth-signup' : 'auth-login')}>{dialog.type === 'auth-login' ? 'Sign up' : 'Log in'}</button></p></>}</>}
      {dialog.type === 'profile' && <><span className="dialog-eyebrow">YOUR ACCOUNT</span><h2 id="dialog-title">My profile</h2>{!profileData ? <p className="dialog-copy">Loading your private profile…</p> : <div className="profile-content">
        <div className="profile-photo-row">{profileData.hasAvatar ? <img className="profile-avatar" src={`/api/profile/avatar?v=${Date.now()}`} alt="Your profile" /> : <span className="profile-avatar profile-avatar-empty"><UserRound size={28} /></span>}<div><strong>{profileData.name}</strong><small>{profileData.email}</small></div></div>
        <label className="profile-file-label">Profile picture<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setAvatarFile(event.target.files?.[0] || null)} /></label><p className="profile-hint">JPG, PNG, or WebP · up to 3 MB</p><button className="button button-outline" type="button" onClick={uploadAvatar} disabled={!avatarFile}>Upload picture</button>
        <form className="dialog-form" onSubmit={saveProfile}><label>Your name<input name="name" defaultValue={profileData.name} minLength="2" required /></label><label>Email address<input value={profileData.email} readOnly /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" defaultValue={profileData.phone} /></label><label>City or area<input name="area" defaultValue={profileData.area} /></label><label>About you<textarea name="bio" rows="3" maxLength="500" defaultValue={profileData.bio} placeholder="Add a short profile description" /></label><button className="button button-primary" type="submit">Save profile <ArrowRight size={16} /></button></form>
        <form className="dialog-form profile-document-form" onSubmit={uploadProfileDocument}><label>Add a private document<input type="file" accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} /></label><p className="profile-hint">PDF, JPG, or PNG · up to 5 MB per file</p><button className="button button-outline" type="submit" disabled={!documentFile}>Upload document</button></form>
        <div className="profile-documents"><strong>Your documents</strong>{profileDocuments.length ? profileDocuments.map((file) => <a key={file.id} href={`/api/profile/documents/${file.id}`}><span>{file.name}</span><small>{(file.size / 1024 / 1024).toFixed(2)} MB · Private download</small></a>) : <p className="profile-hint">You have not uploaded any documents.</p>}</div>
        <p className="profile-privacy" role="status">{profileNotice || 'Only your signed-in account can access these files. Temporary demo storage can be cleared on restart or redeploy. Upload sample files only; do not use IDs, financial records, or sensitive originals.'}</p>
      </div>}</>}
      {dialog.type === 'requests' && <><span className="dialog-eyebrow">THIS BROWSER SESSION</span><h2 id="dialog-title">My requests</h2>{sessionRequests.length || sessionProviderInterest.length ? <div className="request-list">{sessionRequests.map((request) => <article className="request-item" key={request.id}><b>{request.service} request</b><span>{request.id} · {request.area}, {request.country}</span><small>Saved in this tab · No provider contacted</small></article>)}{sessionProviderInterest.map((interest, index) => <article className="request-item" key={`${interest.name}-${index}`}><b>Provider interest · {interest.trade}</b><span>{interest.name} · {interest.area}, {interest.country}</span><small>Saved in this tab · Not sent to ServiceConnect</small></article>)}</div> : <p className="dialog-copy">{currentUser ? 'No requests are saved to this demo account yet. Choose a service or provider option to start one.' : 'Log in or create an account to view saved requests.'}</p>}<button className="button button-primary" onClick={() => { setDialog(null); goTo('services') }}>Browse services <ArrowRight size={16} /></button></>}
      {dialog.type === 'chat' && <><span className="dialog-eyebrow">SERVICECONNECT MESSENGER</span><h2 id="dialog-title">How can we help?</h2><p className="dialog-copy"><span className="messenger-status-dot" /> Messenger preview · replies are automated and stay in this browser session; a live agent is not connected yet.</p><div className="chat-transcript" aria-live="polite">{chatMessages.map(({ id, sender, text }) => <div className={`chat-message ${sender === 'user' ? 'chat-message-user' : ''}`} key={id}><small>{sender === 'user' ? 'You' : 'ServiceConnect'}</small><p>{text}</p></div>)}</div><form className="chat-form" onSubmit={submitChatMessage}><label className="sr-only" htmlFor="chat-message-input">Your message</label><input id="chat-message-input" name="message" autoComplete="off" placeholder="Write a message…" maxLength="500" required /><button className="button button-primary" type="submit" aria-label="Send message"><Send size={17} /></button></form></>}
      {dialog.type === 'app' && <><span className="dialog-eyebrow">APP STATUS</span><h2 id="dialog-title">Mobile app coming soon</h2><p className="dialog-copy">The App Store and Google Play apps are not published yet. You can browse services and preview the request form on this website.</p><button className="button button-primary" onClick={() => { setDialog(null); goTo('services') }}>Browse services <ArrowRight size={16} /></button></>}
      {['support', 'social'].includes(dialog.type) && <><span className="dialog-eyebrow">SERVICECONNECT</span><h2 id="dialog-title">{dialog.type === 'support' ? 'Support contact coming soon' : 'Social links coming soon'}</h2><p className="dialog-copy">These contact channels have not been configured yet. No message has been sent.</p><button className="button button-primary" onClick={() => setDialog(null)}>Close</button></>}
      {['privacy', 'terms'].includes(dialog.type) && <><span className="dialog-eyebrow">{dialog.type === 'privacy' ? 'PRIVACY' : 'TERMS'}</span><h2 id="dialog-title">{dialog.type === 'privacy' ? 'Demo privacy notice' : 'Demo site terms'}</h2><p className="dialog-copy">{dialog.type === 'privacy' ? 'This demo does not send form details to a server. Service request details remain in page memory for this open tab and are cleared when you leave or refresh.' : 'This page is a product demo. Requests created here are not sent to professionals, no bookings or payments are made, and service availability is not guaranteed.'}</p><button className="button button-primary" onClick={() => setDialog(null)}>Close</button></>}
    </section></div>}
  </div>
}

export default App

