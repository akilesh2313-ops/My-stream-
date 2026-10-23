import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const KEY = 'my-stream:projects:v1';
const starterPrompts = [
  { title: 'Habit tracker', prompt: 'A habit tracker with daily streaks, reminders, weekly progress, and a calm minimal design.', icon: '◷', tone: 'violet' },
  { title: 'Study planner', prompt: 'A study planner with subjects, focus sessions, assignment deadlines, and progress summaries.', icon: '▤', tone: 'blue' },
  { title: 'Personal finance', prompt: 'A personal finance app to track expenses, budgets, categories, and monthly spending.', icon: '₹', tone: 'green' }
];
const uid = () => globalThis.crypto?.randomUUID?.() || 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const cleanPackage = value => value.toLowerCase().replace(/[^a-z0-9.]/g, '').replace(/\.+/g, '.').replace(/^\.|\.$/g, '') || 'com.example.myapp';
const initialProjects = () => {
  try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
};
function makeProject({ name, prompt, platform, theme }) {
  const safeName = name.trim() || 'My New App';
  return {
    id: uid(), name: safeName, prompt: prompt.trim(), platform, theme,
    packageId: 'com.mystream.' + cleanPackage(safeName.replace(/\s+/g, '')).split('.').pop(),
    createdAt: new Date().toISOString(), status: 'Blueprint ready',
    screens: [
      { name: 'Home', purpose: 'Primary overview and navigation' },
      { name: 'Details', purpose: 'View and edit an item' },
      { name: 'Settings', purpose: 'Preferences and app information' }
    ],
    features: prompt.split(/[,.\n]/).map(x => x.trim()).filter(Boolean).slice(0, 8)
  };
}
function downloadFile(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  URL.revokeObjectURL(url);
}
function App() {
  const [page, setPage] = useState('Overview');
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(null);
  const [appName, setAppName] = useState('My New App');
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('Android + Web');
  const [theme, setTheme] = useState('Midnight');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [packageId, setPackageId] = useState('');
  const [accent, setAccent] = useState('#8b72ff');
  const [buildLog, setBuildLog] = useState([]);
  const selected = projects.find(p => p.id === selectedId) || projects[0] || null;
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(projects)); } catch { /* storage optional */ } }, [projects]);
  useEffect(() => {
    if (selected) {
      setCustomName(selected.name);
      setPackageId(selected.packageId);
      setTheme(selected.theme || 'Midnight');
    }
  }, [selectedId]); // sync editor when switching projects
  const filtered = useMemo(() => projects.filter(p => (p.name + ' ' + p.prompt).toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const notify = message => { setNotice(message); window.setTimeout(() => setNotice(''), 3200); };
  const createProject = () => {
    if (!prompt.trim()) { notify('Describe the app you want to create first.'); return; }
    const project = makeProject({ name: appName, prompt, platform, theme });
    setProjects(current => [project, ...current]);
    setSelectedId(project.id);
    setPage('Customizer');
    notify('App blueprint created and saved on this device.');
  };
  const updateSelected = patch => {
    if (!selected) return;
    setProjects(current => current.map(p => p.id === selected.id ? { ...p, ...patch } : p));
  };
  const saveCustomization = () => {
    if (!selected) { notify('Create an app first.'); return; }
    if (!customName.trim()) { notify('Enter an app name.'); return; }
    updateSelected({ name: customName.trim(), packageId: cleanPackage(packageId), theme });
    notify('Project settings saved.');
  };
  const exportBlueprint = project => {
    if (!project) return;
    downloadFile(project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-blueprint.json', JSON.stringify({
      product: 'My Stream', schemaVersion: 1, project, customization: { accent, theme },
      build: { type: 'blueprint-only', apkGenerated: false, note: 'This export is a project specification, not an Android APK.' }
    }, null, 2));
    notify('Blueprint JSON exported.');
  };
  const requestBuild = () => {
    if (!selected) { notify('Create or select a project first.'); return; }
    const entry = { id: uid(), project: selected.name, at: new Date().toISOString(), status: 'Not built', detail: 'A native APK build runner is not configured in this repository yet.' };
    setBuildLog(current => [entry, ...current]);
    setPage('Builds');
  };
  const nav = [
    { name: 'Overview', icon: '◫', group: 'WORKSPACE' },
    { name: 'AI Builder', icon: '✦', group: 'WORKSPACE' },
    { name: 'Customizer', icon: '◈', group: 'WORKSPACE' },
    { name: 'Projects', icon: '▤', group: 'MANAGE' },
    { name: 'Builds', icon: '⬡', group: 'MANAGE' }
  ];
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage('Overview')}><span className="brand-mark">M</span><span>my<span className="brand-light">stream</span><small>APP STUDIO</small></span></button>
      {['WORKSPACE', 'MANAGE'].map(group => <div key={group} className="nav-group"><div className="side-label">{group}</div>{nav.filter(n => n.group === group).map(item => <button key={item.name} className={'nav-item ' + (page === item.name ? 'selected' : '')} onClick={() => setPage(item.name)}><span className="nav-icon">{item.icon}</span>{item.name}{item.name === 'Projects' && <span className="nav-count">{projects.length}</span>}</button>)}</div>)}
      <div className="sidebar-bottom"><div className="avatar">MS</div><div><strong>My Stream Studio</strong><small>Build your next idea</small></div><span className="status-dot" title="Local app mode" /></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="mobile-brand"><span className="brand-mark">M</span> My Stream</div><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div><div className="top-actions"><span className="local-pill"><i /> Local workspace</span><button className="primary small" onClick={() => setPage('AI Builder')}>＋ New app</button></div></header>
      <div className="page-wrap">
        {page === 'Overview' && <><section className="welcome"><div className="welcome-copy"><div className="eyebrow"><span className="sparkle">✦</span> YOUR APP STARTS HERE</div><h1>Turn your idea into<br/><span>something real.</span></h1><p>Design an app concept, customize its identity, and prepare a project blueprint for an Android build.</p><div className="welcome-actions"><button className="primary" onClick={() => setPage('AI Builder')}>✦ Create with AI <span>↗</span></button><button className="secondary" onClick={() => setPage('Projects')}>Browse projects</button></div><div className="honest-note"><span>ⓘ</span> Blueprint generation is available now. APK compilation requires a configured Android build runner.</div></div><div className="hero-visual" aria-hidden="true"><div className="glow" /><div className="phone"><div className="phone-top"><span /><span>•••</span></div><div className="phone-art">✦</div><div className="phone-line wide"/><div className="phone-line"/><div className="phone-cards"><i/><i/><i/></div><div className="phone-button"/></div><div className="float-tag tag-top">✦ AI blueprint</div><div className="float-tag tag-bottom">◈ Android-ready workflow</div></div></section>
        <section className="stats"><div className="stat-card"><span className="stat-icon purple">▤</span><div><span>Saved projects</span><strong>{projects.length}</strong><small>Stored on this device</small></div></div><div className="stat-card"><span className="stat-icon blue">✦</span><div><span>App blueprints</span><strong>{projects.length}</strong><small>Ready to customize</small></div></div><div className="stat-card"><span className="stat-icon green">⬡</span><div><span>APK builds</span><strong>0</strong><small>Build runner not configured</small></div></div></section>
        <section className="section"><div className="section-title"><div><div className="eyebrow muted">GET STARTED</div><h2>Start with a direction</h2></div><button className="text-link" onClick={() => setPage('AI Builder')}>Open AI Builder ↗</button></div><div className="starter-grid">{starterPrompts.map(s => <button className="starter-card" key={s.title} onClick={() => {setAppName(s.title);setPrompt(s.prompt);setPage('AI Builder')}}><span className={'starter-icon '+s.tone}>{s.icon}</span><strong>{s.title}</strong><p>{s.prompt}</p><span className="card-arrow">↗</span></button>)}</div></section>
        <section className="section"><div className="section-title"><div><div className="eyebrow muted">RECENT WORK</div><h2>Your projects</h2></div><button className="text-link" onClick={() => setPage('Projects')}>View all ↗</button></div>{projects.length ? <div className="project-list">{projects.slice(0,3).map(p => <ProjectRow key={p.id} project={p} onOpen={() => {setSelectedId(p.id);setPage('Customizer')}} onExport={() => exportBlueprint(p)}/>)}</div> : <Empty title="Your workspace is ready" detail="Create your first app blueprint to see it here." action="Create an app" onAction={() => setPage('AI Builder')}/>}</section></>}
        {page === 'AI Builder' && <section className="builder-layout"><div className="builder-intro"><div className="eyebrow"><span className="sparkle">✦</span> AI APP BUILDER</div><h1>What do you want<br/>to <span>build today?</span></h1><p>Describe your app in plain language. My Stream will turn your description into an editable project blueprint with starter screens and feature notes.</p><div className="builder-benefits"><div><b>01</b><span><strong>Describe</strong><small>Tell us what your app should do.</small></span></div><div><b>02</b><span><strong>Customize</strong><small>Set your app identity and theme.</small></span></div><div><b>03</b><span><strong>Prepare</strong><small>Export a blueprint for implementation.</small></span></div></div><div className="notice-box"><strong>Current capability</strong><p>This version creates a local structured blueprint. It does not call a hosted AI model or compile an APK yet.</p></div></div><div className="builder-panel"><div className="panel-heading"><span className="panel-icon">✦</span><div><strong>New app project</strong><small>Project details</small></div><span className="step">STEP 01</span></div><label className="field-label" htmlFor="app-name">App name</label><input id="app-name" className="text-input" value={appName} onChange={e => setAppName(e.target.value)} placeholder="e.g. Daily Focus"/><label className="field-label" htmlFor="app-prompt">Describe your app <span>Required</span></label><textarea id="app-prompt" className="text-area" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="I want an app that helps people..." rows="6"/><div className="prompt-help">Tip: include the audience, main features, and visual style.</div><div className="field-row"><div><label className="field-label" htmlFor="platform">Target platform</label><select id="platform" className="text-input" value={platform} onChange={e => setPlatform(e.target.value)}><option>Android + Web</option><option>Android</option><option>Web prototype</option></select></div><div><label className="field-label" htmlFor="theme">Starter theme</label><select id="theme" className="text-input" value={theme} onChange={e => setTheme(e.target.value)}><option>Midnight</option><option>Light</option><option>Ocean</option><option>Forest</option></select></div></div><button className="primary create-button" onClick={createProject}>Generate app blueprint <span>✦</span></button><p className="fine-print">No account needed. Your project is saved in this browser.</p><div className="suggestions"><span>Try a template</span>{starterPrompts.map(s => <button key={s.title} onClick={() => {setAppName(s.title);setPrompt(s.prompt)}}>{s.title}</button>)}</div></div></section>}
        {page === 'Customizer' && <section className="section"><div className="eyebrow muted">APP IDENTITY</div><h1 className="page-heading">Customize your app</h1><p className="page-subtitle">Set the display name, Android package ID, and visual theme for your selected project.</p>{selected ? <div className="customizer-grid"><div className="settings-card"><div className="card-heading"><span className="stat-icon purple">◈</span><div><h3>App configuration</h3><p>These settings are included in the exported blueprint.</p></div></div><label className="field-label" htmlFor="custom-name">Display name</label><input id="custom-name" className="text-input" value={customName} onChange={e => setCustomName(e.target.value)}/><label className="field-label" htmlFor="package-id">Android package ID</label><input id="package-id" className="text-input" value={packageId} onChange={e => setPackageId(e.target.value)} placeholder="com.example.myapp"/><p className="prompt-help">Use reverse-domain format, for example com.company.myapp.</p><label className="field-label" htmlFor="theme-select">Color theme</label><select id="theme-select" className="text-input" value={theme} onChange={e => setTheme(e.target.value)}><option>Midnight</option><option>Light</option><option>Ocean</option><option>Forest</option></select><label className="field-label" htmlFor="accent-color">Accent color</label><div className="color-row"><input id="accent-color" type="color" value={accent} onChange={e => setAccent(e.target.value)}/><code>{accent}</code></div><div className="button-row"><button className="primary" onClick={saveCustomization}>Save changes</button><button className="secondary" onClick={() => exportBlueprint({...selected,name:customName || selected.name,packageId:cleanPackage(packageId),theme})}>Export blueprint JSON</button></div></div><div className="preview-card"><div className="preview-head"><strong>Live identity preview</strong><span>PREVIEW</span></div><div className={'preview-device '+(theme==='Light'?'light-preview':'')}><div className="preview-status"><span>9:41</span><span>●●●</span></div><div className="preview-app-icon" style={{background:accent}}>✦</div><h3>{customName || 'Your App Name'}</h3><p>Your app starts here.</p><div className="preview-widget" style={{borderColor:accent+'77'}}><i style={{background:accent}}/><i/><i/></div><button style={{background:accent}}>Get started</button></div><div className="preview-caption"><span className="status-dot"/> Changes preview locally. This is not a compiled Android screen.</div><div className="project-meta"><span>Selected project</span><strong>{selected.name}</strong><span>Target</span><strong>{selected.platform}</strong><span>Created</span><strong>{new Date(selected.createdAt).toLocaleDateString()}</strong></div></div></div> : <Empty title="No project selected" detail="Create an app blueprint first, then customize its identity." action="Open AI Builder" onAction={() => setPage('AI Builder')}/>}</section>}
        {page === 'Projects' && <section className="section"><div className="section-title"><div><div className="eyebrow muted">YOUR WORKSPACE</div><h1 className="page-heading">Projects</h1><p className="page-subtitle">Manage app blueprints saved in this browser.</p></div><button className="primary" onClick={() => setPage('AI Builder')}>＋ New project</button></div><input className="text-input project-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects..."/>{filtered.length ? <div className="project-list">{filtered.map(p => <ProjectRow key={p.id} project={p} onOpen={() => {setSelectedId(p.id);setPage('Customizer')}} onExport={() => exportBlueprint(p)} onDelete={() => {setProjects(current=>current.filter(x=>x.id!==p.id));if(selectedId===p.id)setSelectedId(null);notify('Project deleted.')}}/>)}</div> : <Empty title={projects.length ? 'No matching projects' : 'No projects yet'} detail={projects.length ? 'Try a different search term.' : 'Create an app blueprint to get started.'} action="Create an app" onAction={() => setPage('AI Builder')}/>}</section>}
        {page === 'Builds' && <section className="section"><div className="eyebrow muted">BUILD CENTER</div><h1 className="page-heading">APK build center</h1><p className="page-subtitle">Track build requests and see what is needed to produce a signed Android package.</p><div className="build-banner"><div className="build-banner-icon">⬡</div><div><h3>Android build runner not configured</h3><p>This repository currently has a web app and blueprint export. A native APK is not generated here yet.</p></div><span className="state-badge">NOT READY</span></div><div className="build-steps">{[{n:'01',title:'Generate your app blueprint',detail:'Describe features and export the project specification.',done:!!projects.length},{n:'02',title:'Create native Android project',detail:'Implement the screens in a native or Capacitor Android project.',done:false},{n:'03',title:'Configure Android SDK and signing',detail:'Build with Gradle and set up a secure signing configuration.',done:false},{n:'04',title:'Build and verify APK',detail:'Run automated build checks and install-test the artifact.',done:false}].map(s=><div className="build-step" key={s.n}><span className={'step-number '+(s.done?'complete':'')}>{s.done?'✓':s.n}</span><div><strong>{s.title}</strong><p>{s.detail}</p></div><span className={'step-state '+(s.done?'ready':'')}>{s.done?'AVAILABLE':'PENDING'}</span></div>)}</div><div className="section-title build-history-title"><div><h2>Build request history</h2><p className="page-subtitle">Requests are tracked locally; no remote build is triggered.</p></div><button className="primary" onClick={requestBuild}>＋ Record build request</button></div>{buildLog.length ? <div className="project-list">{buildLog.map(b=><div className="build-log" key={b.id}><span className="stat-icon blue">⬡</span><div><strong>{b.project}</strong><p>{new Date(b.at).toLocaleString()} · {b.detail}</p></div><span className="state-badge">{b.status}</span></div>)}</div> : <div className="empty-inline">No build requests recorded yet.</div>}</section>}
      </div>
      <footer className="app-footer"><span>MY STREAM STUDIO <span className="footer-dot">•</span> PROJECT BLUEPRINT TOOL</span><span>Local-first workspace · 2026</span></footer>
    </main>
    {notice && <div className="toast" role="status">{notice}</div>}
  </div>;
}
function ProjectRow({project,onOpen,onExport,onDelete}) {
  return <div className="project-row"><div className="project-icon">✦</div><div className="project-info"><strong>{project.name}</strong><p>{project.prompt || 'No description'} </p><div className="project-tags"><span>{project.platform}</span><span>{project.theme}</span><span>{new Date(project.createdAt).toLocaleDateString()}</span></div></div><span className="blueprint-badge">BLUEPRINT</span><div className="row-actions"><button onClick={onOpen}>Customize</button><button onClick={onExport}>Export</button>{onDelete && <button className="delete-action" onClick={onDelete}>Delete</button>}</div></div>;
}
function Empty({title,detail,action,onAction}) { return <div className="empty-state"><span>✦</span><h3>{title}</h3><p>{detail}</p><button className="primary" onClick={onAction}>{action} ↗</button></div>; }
createRoot(document.getElementById('root')).render(<App />);
