import http from 'http';

const port = 8001;

// Generate 500 mock survey responses
const mockData = Array.from({ length: 500 }, (_, i) => ({
    id: (1000 + i).toString(),
    university: ['Lebanese University', 'Beirut Arab University', 'USJ'][i % 3],
    track: ['AI Fundamentals', 'Data Ethics', 'Cloud Connectivity'][i % 3],
    region: ['Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 'Bekaa'][i % 5],
    gender: i % 2 === 0 ? 'Male' : 'Female',
    age: 18 + (i % 15),
    name: `Learner ${i}`,
    email: `learner${1000 + i}@example.com`,
    phone: `+961 70 ${100000 + i}`,
    source: ['University Partner', 'Social Media', 'Direct'][i % 3],
    motivation: ['Upskilling for job', 'Personal interest', 'Required by employer'][i % 3],
    status: 'Active'
}));

const requestListener = function (req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/api/responses' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(mockData));
    } else {
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(404);
        res.end('Not Found');
    }
};

const server = http.createServer(requestListener);

server.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
