// src/script.js

// 1) Imports
import { getAccessCount } from "./tracker.js";
import { checkCookieConsent } from "./cookies.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// 2) Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC2_Mtqdmvyv14P9nDDDnlaRdmafILeVHA",
  authDomain: "stocklooper.firebaseapp.com",
  projectId: "stocklooper",
  storageBucket: "stocklooper.appspot.com",
  messagingSenderId: "1047586877035",
  appId: "1:1047586877035:web:4ce28a629f47bbe78d0b2e",
  measurementId: "G-QCST671SPB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// 3) Increment Access Counter
async function incrementAccessCount() {
  const counterRef = doc(db, "pageViews", "counter");
  try {
    const docSnap = await getDoc(counterRef);
    if (docSnap.exists()) {
      await updateDoc(counterRef, { count: docSnap.data().count + 1 });
    } else {
      await setDoc(counterRef, { count: 1 });
    }
  } catch (error) {
    console.error("Erro ao atualizar contador:", error);
  }
}

incrementAccessCount();

window.addEventListener('DOMContentLoaded', async () => {
  const count = await getAccessCount();
  
  const isPortuguese = window.location.pathname.includes('-pt');
  const suffix = isPortuguese ? 'pessoas viram isto' : 'people saw this';

  document.getElementById('accessTracker').textContent = `🙋 ${count} ${suffix}`;
  checkCookieConsent();
});


// 5) Similarities and Base Constants
const similarities = [1.0, 0.6724, 0.6396, 0.6036, 0.6036, -0.124, -0.124, 0.2036, 0.2036, 1.0];
const baseEquity2024 = 20495015000;
const slopeEquity = 1356288891;
const baseShares2024 = 766646508;
const slopeShares = 5007131;
const deltaHistory = [];

// 6) Chart Setup
const ctx = document.getElementById('grafico').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 51 }, (_, i) => i % 10 === 0 ? String(2025 + i / 10) : ''),
    datasets: []
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    layout: { padding: { top: 10, bottom: 20 } },
    scales: {
      y: {
        beginAtZero: false,
        min: 125,
        max: 161,
        ticks: { stepSize: 1, color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: {
        ticks: { color: 'white', autoSkip: false, maxRotation: 0, minRotation: 0 },
        grid: { color: ctx => ctx.tick.label ? 'rgba(255,255,255,0.1)' : 'transparent' }
      }
    }
  }
});

document.body.style.backgroundColor = '#0b0d26';
document.body.style.color = 'white';

// 7) Core Functions
function runSimulationNoise(mainPrices) {
  const interpolated = [];
  for (let i = 0; i < mainPrices.length - 1; i++) {
    const start = mainPrices[i];
    const end = mainPrices[i + 1];
    interpolated.push(start);
    for (let j = 1; j <= 9; j++) {
      const frac = j / 10;
      const baseVal = start + (end - start) * frac;
      const noiseVal = baseVal * ((Math.random() - 0.5) * 0.04 + 1);
      interpolated.push(noiseVal);
    }
  }
  interpolated.push(mainPrices[mainPrices.length - 1]);
  return interpolated;
}

function updateBubble(slider, bubble) {
  const val = slider.value;
  const percent = ((val - slider.min) / (slider.max - slider.min)) * 100;
  bubble.textContent = `${val}%`;
  bubble.style.left = `calc(${percent}% - 20px)`;
  bubble.style.opacity = '0.9';

  clearTimeout(bubble.hideTimeout);
  bubble.hideTimeout = setTimeout(() => {
    bubble.style.opacity = '0';
  }, 300);
}

function runSimulation() {
  let totalImpact = 0;
  for (let i = 1; i <= 10; i++) {
    const val = +document.getElementById(`slider${i}`).value;
    totalImpact += (val / 100 - 1) * similarities[i - 1];
  }
  const avgImpact = totalImpact;
  const mainPrices = [];
  for (let year = 1; year <= 6; year++) {
    const eq = baseEquity2024 + slopeEquity * (1 + avgImpact) * year;
    const sh = baseShares2024 + slopeShares * year;
    const noiseF = (Math.random() - 0.5) * 0.04 + 1;
    mainPrices.push(eq / sh * noiseF + 110);
  }
  const finalData = noiseActive ? runSimulationNoise(mainPrices) : new Array(51).fill(null).map((_, idx) => idx % 10 === 0 ? mainPrices[idx / 10] : null);
  const color = getLineColorFromImpact(avgImpact);
  chart.data.datasets.push({
    data: finalData,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1,
    tension: 0.3,
    fill: false,
    spanGaps: true,
    showLine: true,
    pointRadius: ctx => ctx.dataIndex % 10 === 0 ? 3 : 0
  });
  chart.update();

  const delta = (mainPrices[5] - mainPrices[0]).toFixed(2);
  updateStockTracker(delta);
}

function updateStockTracker(delta) {
  const tracker = document.getElementById("trackerList");
  deltaHistory.unshift(delta);
  if (deltaHistory.length > 5) deltaHistory.pop();

  tracker.innerHTML = "";
  deltaHistory.forEach((d, index) => {
    const item = document.createElement("div");
    item.textContent = `Run ${deltaHistory.length - index}: ${d >= 0 ? "+" : ""}$${d}`;
    tracker.appendChild(item);
  });
}

function getLineColorFromImpact(impact) {
  const baseColor = [82, 190, 255];
  const opacity = 1 - Math.min(Math.abs(impact) * 10, 0.9);
  return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity.toFixed(2)})`;
}

function resetSliders() {
  for (let i = 1; i <= 10; i++) {
    const slider = document.getElementById(`slider${i}`);
    const bubble = document.getElementById(`bubble${i}`);
    slider.value = 100;
    updateBubble(slider, bubble);
  }
}

function clearChart() {
  chart.data.datasets = [];
  chart.update();
  deltaHistory.length = 0;
  document.getElementById("trackerList").innerHTML = "";
}

function randomSliders() {
  for (let i = 1; i <= 10; i++) {
    const value = Math.floor(Math.random() * 101) + 50;
    const slider = document.getElementById(`slider${i}`);
    const bubble = document.getElementById(`bubble${i}`);
    slider.value = value;
    updateBubble(slider, bubble);
  }
  runSimulation();
}

function applyScenario(type) {
  const scenarios = {
    boom: [150, 150, 150, 150, 150, 50, 50, 50, 50, 50],
    recession: [50, 50, 50, 50, 50, 150, 150, 150, 150, 150],
    split: [50, 100, 150, 100, 100, 50, 100, 100, 100, 100],
    inflation: [50, 120, 90, 110, 80, 150, 150, 150, 150, 150]
  };

  const values = scenarios[type];
  if (!values) return;

  for (let i = 0; i < 10; i++) {
    const slider = document.getElementById(`slider${i + 1}`);
    const bubble = document.getElementById(`bubble${i + 1}`);
    slider.value = values[i];
    updateBubble(slider, bubble);
  }
  runSimulation();
}

const noiseBtn = document.getElementById('noiseBtn');
let noiseActive = true;
noiseBtn.textContent = '🔇 Silence?';
noiseBtn.addEventListener('click', () => {
  noiseActive = !noiseActive;
  noiseBtn.textContent = noiseActive ? '🔇 Silence?' : '🔊 Noise?';
  clearChart();
  runSimulation();
});

// Event Listeners for buttons

for (let i = 1; i <= 10; i++) {
  const slider = document.getElementById(`slider${i}`);
  const bubble = document.getElementById(`bubble${i}`);
  slider.addEventListener("input", () => updateBubble(slider, bubble));
}

document.getElementById("runBtn").addEventListener("click", runSimulation);
document.getElementById("resetBtn").addEventListener("click", resetSliders);
document.getElementById("randomBtn").addEventListener("click", randomSliders);
document.getElementById("cleanBtn").addEventListener("click", clearChart);

// Expose functions to window (for HTML onclick)
window.applyScenario = applyScenario;

