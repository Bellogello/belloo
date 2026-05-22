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
  // 1. Initialize state with current location
  const [path, setPath] = useState(window.location.pathname + window.location.hash);
  const [data] = useState(siteData);

  // 2. Navigation Listener (The SPA Engine)
  // This allows links to change the URL without reloading the page
  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // 3. Define the Global Navigate Helper
  // Pass this to Navbar and Home so they can use it
  const navigate = (e, targetPath) => {
    e.preventDefault();
    window.history.pushState({}, "", targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // 4. Dashboard override
  if (path === '/dashboard') return <Dashboard />;

  // 5. Main Application Structure
  return (
    <AudioProvider>
      <Cursor />
      {/* Pass navigate to Navbar so it can update the route */}
      <Navbar navigate={navigate} />
      
      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-32">
        {path === '/' && <Home data={data} navigate={navigate} />}
        {path === '/projects' && <Projects projects={data.projects} />}
        {path === '/contact' && <Contact />}
      </main>
      
      {/* MusicPlayer now sits outside the re-rendering <main> */}
      <MusicPlayer playlist={data.playlist} />
    </AudioProvider>
  );
}