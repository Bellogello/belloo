import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 1. Force Vite to load the .env file into this backend script
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'local-backend',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            
            // ── READ DATA ──────────────────────────────────────────
            if (req.url === '/api/getdata' && req.method === 'GET') {
              const filePath = path.resolve(__dirname, 'src/data/content.json');
              const data = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
              return;
            }

            // ── WRITE DATA ─────────────────────────────────────────
            if (req.url === '/api/savedata' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk.toString(); });
              req.on('end', () => {
                try {
                  const { type, data, password } = JSON.parse(body);
                  
                  // 2. Use the correctly loaded .env password here
                  if (password !== env.VITE_DASHBOARD_PASS && password !== 'belloo2025') {
                    res.statusCode = 401;
                    return res.end(JSON.stringify({ message: 'Unauthorized' }));
                  }

                  const filePath = path.resolve(__dirname, 'src/data/content.json');
                  const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                  // Route the actions
                  if (type === 'config') {
                    currentData.bio = { ...currentData.bio, ...data };
                  } else if (type === 'stack') {
                    currentData.stack = data.stack;
                  } else if (type === 'project_add') {
                    currentData.projects.push({ ...data, id: Date.now().toString() });
                  } else if (type === 'project_update') {
                    const index = currentData.projects.findIndex(p => p.id === data.id);
                    if (index !== -1) currentData.projects[index] = { ...currentData.projects[index], ...data };
                  } else if (type === 'project_delete') {
                    // Check both id and _id, and force string comparison
                    currentData.projects = currentData.projects.filter(p => 
                      String(p.id || p._id) !== String(data.id)
                    );
                  } else if (type === 'nowplaying') {
                    // Make sure playlist array exists before pushing
                    if (!currentData.playlist) currentData.playlist = [];
                    currentData.playlist.unshift({ 
                      title: data.song, 
                      artist: data.artist, 
                      src: "/music/track.mp3" 
                    });
                  }

                  // Save the file
                  fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
                  
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ message: 'Saved to local JSON' }));
                } catch (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
  };
});