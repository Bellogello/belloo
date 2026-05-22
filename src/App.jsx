import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Dashboard from './pages/dashboard';

export default function App() {
  const path = window.location.pathname;
  const [data, setData] = useState(null);

  // 1. Dashboard override (intercept immediately, no navbar)
  if (path === '/dashboard') return <Dashboard />;

  // 2. Fetch the JSON data
  useEffect(() => {
    fetch('/api/getdata')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to load local data", err));
  }, []);

  // 3. Loading state
  if (!data) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-on-surface-variant">INIT SYSTEM...</div>;

  // 4. Render the Layout
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-32">
        {path === '/' && <Home data={data} />}
        {path === '/projects' && <Projects projects={data.projects} />}
        {path === '/contact' && <Contact />}
      </main>
      <MusicPlayer playlist={data.playlist} />
    </>
  );
}