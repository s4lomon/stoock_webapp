// src/fire.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configuração do seu projeto no Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2_Mtqdmvyv14P9nDDDnlaRdmafILeVHA",
  authDomain: "stocklooper.firebaseapp.com",
  projectId: "stocklooper",
  storageBucket: "stocklooper.firebasestorage.app",
  messagingSenderId: "1047586877035",
  appId: "1:1047586877035:web:4ce28a629f47bbe78d0b2e",
  measurementId: "G-QCST671SPB"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db        = getFirestore(app);
