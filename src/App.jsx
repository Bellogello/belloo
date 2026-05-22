import { useState } from 'react';
import siteData from './data/content.json';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Dashboard from './pages/dashboard';

export default function App() {
  const path = window.location.pathname;
  const [data] = useState(siteData);

  if (path === '/dashboard') return <Dashboard />;

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