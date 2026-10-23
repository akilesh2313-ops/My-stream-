import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const STORAGE_KEY = 'my-stream:saved-videos';

const videosCatalog = [
  { id: 1, title: 'The world in 4K', creator: 'Open Horizons', category: 'Explore', duration: '12:48', color: 'violet', views: '128K views', viewCount: 128000, emoji: '🌄' },
  { id: 2, title: 'Late night lo-fi mix', creator: 'Quiet Room', category: 'Music', duration: '48:02', color: 'blue', views: '84K views', viewCount: 84000, emoji: '🎧' },
  { id: 3, title: 'Build something brilliant', creator: 'Maker Lab', category: 'Learning', duration: '18:36', color: 'orange', views: '42K views', viewCount: 42000, emoji: '🛠️' },
  { id: 4, title: 'A little space to breathe', creator: 'Slow Days', category: 'Lifestyle', duration: '09:15', color: 'green', views: '67K views', viewCount: 67000, emoji: '🌿' },
  { id: 5, title: 'Indie discoveries', creator: 'Sound Scout', category: 'Music', duration: '23:10', color: 'pink', views: '31K views', viewCount: 31000, emoji: '🎵' },
  { id: 6, title: 'Designing the future', creator: 'Pixel People', category: 'Learning', duration: '15:44', color: 'cyan', views: '56K views', viewCount: 56000, emoji: '✨' }
];

const categories = ['All', 'Explore', 'Music', 'Learning', 'Lifestyle'];
const navigation = [
  { label: 'Home', icon: '⌂' },
  { label: 'Explore', icon: '◈' },
  { label: 'Trending', icon: '↗' },
  { label: 'Music', icon: '♫' },
  { label: 'Saved', icon: '▣' }
];

function readSavedVideos() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter(id => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

function App() {
  const [tab, setTab] = useState('Home');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(readSavedVideos);
  const [active, setActive] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // The app remains usable when storage is unavailable or disabled.
    }
  }, [saved]);

  const videos = useMemo(() => {
    let result = videosCatalog.filter(video =>
      (category === 'All' || video.category === category) &&
      (tab !== 'Saved' || saved.includes(video.id)) &&
      (video.title + ' ' + video.creator + ' ' + video.category).toLowerCase().includes(search.trim().toLowerCase())
    );

    if (tab === 'Trending') {
      result = [...result].sort((a, b) => b.viewCount - a.viewCount);
    }

    return result;
  }, [category, search, tab, saved]);

  const toggleSaved = id => {
    setSaved(current => current.includes(id)
      ? current.filter(savedId => savedId !== id)
      : [...current, id]);
  };

  const selectTab = item => {
    setTab(item);
    setActive(null);
    if (item === 'Music') setCategory('Music');
    else setCategory('All');
  };

  const heading = {
    Saved: 'Your saved stream',
    Trending: 'Trending now',
    Explore: 'Explore everything',
    Music: 'Music for the moment'
  }[tab] || 'Made for your mood';

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <button className="brand" type="button" onClick={() => selectTab('Home')} aria-label="My Stream home">
          <span className="brand-mark" aria-hidden="true">▶</span>
          <span>my<span className="brand-light">stream</span></span>
        </button>
        <div className="side-label">DISCOVER</div>
        <nav>
          {navigation.map(item => (
            <button
              key={item.label}
              type="button"
              className={'nav-item ' + (tab === item.label ? 'selected' : '')}
              aria-current={tab === item.label ? 'page' : undefined}
              onClick={() => selectTab(item.label)}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.label === 'Saved' && saved.length > 0 && <span className="count">{saved.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="avatar" aria-hidden="true">MS</div>
          <div><strong>My Stream</strong><small>Your space, your vibe.</small></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-brand" type="button" onClick={() => selectTab('Home')} aria-label="My Stream home">
            <span className="brand-mark" aria-hidden="true">▶</span>
            <span>my<span className="brand-light">stream</span></span>
          </button>
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search videos, creators..."
              aria-label="Search videos, creators and categories"
            />
            <kbd aria-hidden="true">⌕</kbd>
          </label>
          <button className="profile-button" type="button" onClick={() => selectTab('Saved')} aria-label="Open saved videos">MS</button>
        </header>

        {active ? (
          <section className="player-page" aria-label="Video preview">
            <button className="back" type="button" onClick={() => setActive(null)}>← Back to {tab}</button>
            <div className={'player-art art-' + active.color} role="img" aria-label={'Artwork for ' + active.title}>
              <span aria-hidden="true">{active.emoji}</span>
              <div className="play-large" aria-hidden="true">▶</div>
            </div>
            <div className="player-meta">
              <div><h1>{active.title}</h1><p>{active.creator} · {active.views}</p></div>
              <button className={'save-button ' + (saved.includes(active.id) ? 'saved' : '')} type="button" onClick={() => toggleSaved(active.id)}>
                {saved.includes(active.id) ? '✓ Saved' : '＋ Save'}
              </button>
            </div>
            <p className="description">This is a sample preview. Real video playback requires a connected media source; no video is streamed by this demo.</p>
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow"><span className="live-dot" /> YOUR WORLD, IN MOTION</div>
                <h1>Find your next<br /><span>favorite thing.</span></h1>
                <p>Stories, sounds, and ideas worth your time.<br />A stream that feels like yours.</p>
                <button className="hero-cta" type="button" onClick={() => selectTab('Explore')}>Explore your stream <span>↗</span></button>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                <div className="hero-disc"><span>▶</span></div>
                <div className="float-card card-a">✦ <span>Fresh finds</span></div>
                <div className="float-card card-b">♫ <span>Good energy</span></div>
                <div className="float-card card-c">◈ <span>Your picks</span></div>
              </div>
              <div className="hero-index" aria-hidden="true">01 <span>/</span> 04</div>
            </section>

            <section className="content-section" aria-labelledby="content-heading">
              <div className="section-heading">
                <div><div className="eyebrow muted">HANDPICKED FOR YOU</div><h2 id="content-heading">{heading}</h2></div>
                <button className="text-link" type="button" onClick={() => selectTab('Explore')}>See all <span>↗</span></button>
              </div>
              <div className="chips" aria-label="Filter by category">
                {categories.map(item => (
                  <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={'chip ' + (category === item ? 'chip-active' : '')}>{item}</button>
                ))}
              </div>
              {videos.length ? (
                <div className="video-grid">
                  {videos.map(video => (
                    <article className="video-card" key={video.id}>
                      <button className={'thumbnail art-' + video.color} type="button" onClick={() => setActive(video)} aria-label={'Preview ' + video.title}>
                        <span className="thumb-emoji" aria-hidden="true">{video.emoji}</span>
                        <span className="duration">{video.duration}</span>
                        <span className="thumb-play" aria-hidden="true">▶</span>
                      </button>
                      <div className="video-info">
                        <div className={'creator-avatar avatar-' + video.color} aria-hidden="true">{video.creator.slice(0, 1)}</div>
                        <div className="video-text">
                          <button className="video-title" type="button" onClick={() => setActive(video)}>{video.title}</button>
                          <div className="creator-name">{video.creator}</div>
                          <div className="views">{video.views} · Demo content</div>
                        </div>
                        <button className={'bookmark ' + (saved.includes(video.id) ? 'bookmarked' : '')} type="button" onClick={() => toggleSaved(video.id)} aria-label={saved.includes(video.id) ? 'Remove ' + video.title + ' from saved videos' : 'Save ' + video.title} aria-pressed={saved.includes(video.id)}>{saved.includes(video.id) ? '▣' : '＋'}</button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty" role="status">
                  <span aria-hidden="true">◌</span><h3>Nothing here just yet</h3>
                  <p>{tab === 'Saved' && saved.length === 0 ? 'Save a video and it will appear here.' : 'Try another search or explore a different category.'}</p>
                  <button className="text-link" type="button" onClick={() => { setSearch(''); setCategory('All'); selectTab('Home'); }}>Back to home ↗</button>
                </div>
              )}
            </section>
            <footer><span>Made for the things you love.</span><span>MY STREAM © 2026</span></footer>
          </>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
