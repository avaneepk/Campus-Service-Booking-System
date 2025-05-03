const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const soap       = require('soap');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -----------------------------------------------------------------------------
// SOAP Login Route
// -----------------------------------------------------------------------------
const WSDL_URL = 'http://localhost:8000/auth?wsdl';  // replace with real WSDL when ready

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  soap.createClient(WSDL_URL, (err, client) => {
    if (err) return res.status(500).json({ error: 'SOAP client error', detail: err });
    client.login({ username, password }, (err, result) => {
      if (err) return res.status(401).json({ error: 'Auth failed', detail: err });
      // on success, return whatever the SOAP service returned
      res.json({ success: true, data: result });
    });
  });
});

// -----------------------------------------------------------------------------
// 1) Stub Booking endpoint (REST)
// -----------------------------------------------------------------------------
app.post('/api/book', (req, res) => {
  console.log('Stub /api/book got:', req.body);
  // pretend it succeeded
  res.json({ success: true, bookingId: 'stub-' + Date.now() });
});

// -----------------------------------------------------------------------------
// 2) Stub Conflict-check endpoint (gRPC stand-in)
// -----------------------------------------------------------------------------
app.post('/api/checkConflict', (req, res) => {
  console.log('Stub /api/checkConflict got:', req.body);
  // always no conflict
  res.json({ conflict: false });
});

// -----------------------------------------------------------------------------
// 3) Stub Room-status endpoint (Sensor data)
// -----------------------------------------------------------------------------
app.get('/api/status', (req, res) => {
  const rooms = ['karaoke', 'sauna', 'band', 'meeting', 'pingpong'];
  const data = rooms.map(r => ({
    room: r,
    occupied: Math.random() < 0.5
  }));
  console.log('Stub /api/status →', data);
  res.json(data);
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Middleware running on http://localhost:${PORT}`));
