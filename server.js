import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function randomBetween(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function generateBlockchainHash() {
  const hex = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 40; i++) {
    hash += hex[Math.floor(Math.random() * hex.length)];
  }
  return hash;
}

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

app.get("/api/sensor-data", (req, res) => {

  let temperature = parseFloat(randomBetween(2, 8));

  if (Math.random() < 0.10) {
    temperature = 12.0;
  }

  temperature = temperature.toFixed(1);

  let risk;
  if (temperature > 8.0) {
    risk = "High";
  } else if (temperature >= 2.0 && temperature <= 8.0) {
    risk = "Low";
  } else {
    risk = "Unknown"; 
  }

  const humidity        = Math.floor(Math.random() * 21) + 40;
  const blockchainHash  = generateBlockchainHash();
  const timestamp       = getTimestamp();

  res.json({
    temperature,      
    humidity,         
    risk,             
    blockchainHash,   
    timestamp,        
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  VitalChain API running at http://localhost:${PORT}/api/sensor-data`);
});
