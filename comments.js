// script.js (corrigido)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Inicializar Firebase
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
const db = getFirestore(app);

// Função para enviar comentário
async function submitComment() {
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, 'comments'), {
      text,
      date: Timestamp.now()
    });
    input.value = '';  // Limpa o campo depois de enviar
  } catch (err) {
    console.error("Erro ao salvar comentário:", err);
  }
}

// Escutar evento do botão de envio
document.getElementById('submitBtn').addEventListener('click', submitComment);

// FUNÇÃO MAIS IMPORTANTE: Atualizar os comentários na tela em tempo real
const commentsQuery = query(collection(db, 'comments'), orderBy('date', 'desc'));
onSnapshot(commentsQuery, (snapshot) => {
  const container = document.getElementById('commentsContainer');
  container.innerHTML = ""; // Limpa o container antes de redesenhar tudo
  snapshot.forEach((doc) => {
    const { text, date } = doc.data();
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <div class="timestamp">${date.toDate().toLocaleString()}</div>
      <div class="text">${text}</div>
    `;
    container.appendChild(div);
  });
});
