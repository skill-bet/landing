const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    if (filePath.startsWith('/partials/')) {
        const partialName = filePath.replace('/partials/', '');
        const partialMap = {
            'waitlist-modal': 'waitlist-modal.html',
            'download-modal': 'download-modal.html',
            'feature-detail/leagues': 'feature-detail-leagues.html',
            'feature-detail/tokens': 'feature-detail-tokens.html',
            'feature-detail/matches': 'feature-detail-matches.html',
            'feature-detail/communities': 'feature-detail-communities.html',
            'feature-detail/rankings': 'feature-detail-rankings.html',
            'feature-detail/safe': 'feature-detail-safe.html',
        };
        
        if (partialMap[partialName]) {
            filePath = '/partials/' + partialMap[partialName];
        } else {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
    }
    
    if (filePath === '/api/waitlist' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<div style="padding: 16px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; margin-top: 16px; color: #22C55E; text-align: center;">✓ ¡Perfecto! Te avisaremos cuando SkillBet esté disponible.</div>');
        });
        return;
    }
    
    if (filePath.startsWith('/partials/animated-counter')) {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const count = parseInt(url.searchParams.get('count') || '0');
        const label = url.searchParams.get('label') || '';
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <span class="stat-number" data-target="${count}">0</span>
            <span class="stat-label">${label}</span>
            <script>
                (function() {
                    const el = document.currentScript.previousElementSibling.previousElementSibling;
                    const target = parseInt(el.dataset.target);
                    const duration = 2000;
                    const start = performance.now();
                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(target * eased).toLocaleString();
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                })();
            </script>
        `);
        return;
    }
    
    if (filePath === '/partials/app-preview') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<img src="skillbet-screenshot.jpeg" alt="SkillBet App Preview" class="preview-image">');
        return;
    }
    
    if (filePath === '/partials/testimonials') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"Finalmente puedo competir con mis amigos sin arriesgar dinero. ¡La mejor app para los amantes del fútbol!"</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-avatar">MG</div>
                    <div class="author-info">
                        <span class="author-name">Miguel García</span>
                        <span class="author-role">Usuario desde 2024</span>
                    </div>
                </div>
            </div>
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"Las ligas privadas son increíbles. Tenemos un grupo de 20 amigos y nos lo pasamos genial cada fin de semana."</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-avatar">LP</div>
                    <div class="author-info">
                        <span class="author-name">Laura Pérez</span>
                        <span class="author-role">Usuario desde 2024</span>
                    </div>
                </div>
            </div>
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"El sistema de rankings me tiene enganchado. Cada predicción cuenta y la competición es sana."</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-avatar">CR</div>
                    <div class="author-info">
                        <span class="author-name">Carlos Ruiz</span>
                        <span class="author-role">Top 100 Global</span>
                    </div>
                </div>
            </div>
        `);
        return;
    }
    
    if (filePath === '/partials/app-store-link') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<a href="https://apps.apple.com/app/skillbet" class="store-btn" style="text-decoration: none;"><svg class="store-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg><div class="store-text"><span class="store-small">Descargar en</span><span class="store-name">App Store</span></div></a>');
        return;
    }
    
    if (filePath === '/partials/play-store-link') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<a href="https://play.google.com/store/apps/details?id=com.skillbet.app" class="store-btn" style="text-decoration: none;"><svg class="store-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg><div class="store-text"><span class="store-small">Disponible en</span><span class="store-name">Google Play</span></div></a>');
        return;
    }
    
    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(fullPath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
