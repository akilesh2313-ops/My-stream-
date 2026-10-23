import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const initial = [
  { id: 1, title: 'The world in 4K', creator: 'Open Horizons', category: 'Explore', duration: '12:48', color: 'violet', views: '128K views', emoji: '🌄' },
  { id: 2, title: 'Late night lo-fi mix', creator: 'Quiet Room', category: 'Music', duration: '48:02', color: 'blue', views: '84K views', emoji: '🎧' },
  { id: 3, title: 'Build something brilliant', creator: 'Maker Lab', category: 'Learning', duration: '18:36', color: 'orange', views: '42K views', emoji: '🛠️' },
  { id: 4, title: 'A little space to breathe', creator: 'Slow Days', category: 'Lifestyle', duration: '09:15', color: 'green', views: '67K views', emoji: '🌿' },
  { id: 5, title: 'Indie discoveries', creator: 'Sound Scout', category: 'Music', duration: '23:10', color: 'pink', views: '31K views', emoji: '🎵' },
  { id: 6, title: 'Designing the future', creator: 'Pixel People', category: 'Learning', duration: '15:44', color: 'cyan', views: '56K views', emoji: '✨' }
];

function App() {
  const [tab, setTab] = useState('Home');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState([]);
  const [active, setActive] = useState(null);
  const categories = ['All', 'Explore', 'Music', 'Learning', 'Lifestyle'];
  const videos = useMemo(() => initial.filter(v =>
    (category === 'All' || v.category === category) &&
    (tab !== 'Saved' || saved.includes(v.id)) &&
    (v.title + v.creator + v.category).toLowerCase().includes(search.toLowerCase())
  ), [category, search, tab, saved]);
  const toggleSaved = id => setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" onClick={() => {setTab('Home'); setActive(null)}}><span className="brand-mark">▶</span><span>my<span className="brand-light">stream</span></span></a>
      <div className="side-label">DISCOVER</div>
      {['Home', 'Explore', 'Trending', 'Music', 'Saved'].map((item, i) =>
        <button key={item} className={'nav-item ' + (tab === item ? 'selected' : '')} onClick={() => {setTab(item); setActive(null); if(item==='Music')setCategory('Music'); else if(item==='Home'||item==='Saved')setCategory('All')}}>
          <span className="nav-icon">{['⌂','◈','↗','♫','▣'][i]}</span>{item}{item==='Saved' && saved.length>0 && <span className="count">{saved.length}</span>}
        </button>
      )}
      <div className="sidebar-bottom"><div className="avatar">MS</div><div><strong>My Stream</strong><small>Your space, your vibe.</small></div></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div className="mobile-brand"><span className="brand-mark">▶</span> my<span className="brand-light">stream</span></div>
        <label className="search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search videos, creators..." /><kbd>⌕</kbd></label>
        <button className="profile-button" onClick={() => alert('Welcome to My Stream!')}>MS</button>
      </header>
      {active ? <section className="player-page">
        <button className="back" onClick={()=>setActive(null)}>← Back to {tab}</button>
        <div className={'player-art art-'+active.color}><span>{active.emoji}</span><div className="play-large">▶</div></div>
        <div className="player-meta"><div><h1>{active.title}</h1><p>{active.creator} · {active.views}</p></div><button className={'save-button '+(saved.includes(active.id)?'saved':'')} onClick={()=>toggleSaved(active.id)}>{saved.includes(active.id)?'✓ Saved':'＋ Save'}</button></div>
        <p className="description">Discover more with My Stream. This is a sample preview card; connect your own video source to play real media.</p>
      </section> : <>
        <section className="hero">
          <div className="hero-copy"><div className="eyebrow"><span className="live-dot"></span> YOUR WORLD, IN MOTION</div><h1>Find your next<br/><span>favorite thing.</span></h1><p>Stories, sounds, and ideas worth your time.<br/>A stream that feels like yours.</p><button className="hero-cta" onClick={()=>{setTab('Explore');setCategory('All')}}>Explore your stream <span>↗</span></button></div>
          <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="hero-disc"><span>▶</span></div><div className="float-card card-a">✦ <span>Fresh finds</span></div><div className="float-card card-b">♫ <span>Good energy</span></div><div className="float-card card-c">◈ <span>Your picks</span></div></div>
          <div className="hero-index">01 <span>/</span> 04</div>
        </section>
        <section className="content-section">
          <div className="section-heading"><div><div className="eyebrow muted">HANDPICKED FOR YOU</div><h2>{tab==='Saved'?'Your saved stream':tab==='Trending'?'Trending now':tab==='Explore'?'Explore everything':tab==='Music'?'Music for the moment':'Made for your mood'}</h2></div><button className="text-link" onClick={()=>{setTab('Explore');setCategory('All')}}>See all <span>↗</span></button></div>
          <div className="chips">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={'chip '+(category===c?'chip-active':'')}>{c}</button>)}</div>
          {videos.length ? <div className="video-grid">{videos.map(v=><article className="video-card" key={v.id}>
            <button className={'thumbnail art-'+v.color} onClick={()=>setActive(v)} aria-label={'Preview '+v.title}><span className="thumb-emoji">{v.emoji}</span><span className="duration">{v.duration}</span><span className="thumb-play">▶</span></button>
            <div className="video-info"><div className={'creator-avatar avatar-'+v.color}>{v.creator.slice(0,1)}</div><div className="video-text"><button className="video-title" onClick={()=>setActive(v)}>{v.title}</button><div className="creator-name">{v.creator}</div><div className="views">{v.views} · Sample content</div></div><button className={'bookmark '+(saved.includes(v.id)?'bookmarked':'')} onClick={()=>toggleSaved(v.id)} title="Save video">{saved.includes(v.id)?'▣':'＋'}</button></div>
          </article>)}</div> : <div className="empty"><span>◌</span><h3>Nothing here just yet</h3><p>Try another search or explore a different category.</p><button className="text-link" onClick={()=>{setSearch('');setCategory('All');setTab('Home')}}>Back to home ↗</button></div>}
        </section>
        <footer>Made for the things you love. <span>MY STREAM © 2026</span></footer>
      </>}
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);