import { useState, useEffect } from 'react';
import siteData from './data/content.json';
import { AudioProvider } from './context/AudioContext';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Dashboard from './pages/dashboard';

export default function App() {
  const [path, setPath] = useState(window.location.pathname + window.location.hash);
  // THIS LINE WAS MISSING:
  const [data] = useState(siteData);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (path === '/dashboard') return <Dashboard />;

  return (
    <AudioProvider>
      <Cursor />
      <Navbar />
      
      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-32">
        {path === '/' && <Home data={data} />}
        {path === '/projects' && <Projects projects={data.projects} />}
        {path === '/contact' && <Contact />}
      </main>
      
      <MusicPlayer playlist={data.playlist} />
    </AudioProvider>
  );
}