// src/tracker.js
import { db } from "./fire.js";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

/**
 * Incrementa (ou cria) o documento de contagem e retorna o valor atualizado.
 */
export async function getAccessCount() {
  const counterRef = doc(db, "accesses", "counter");
  try {
    const snap = await getDoc(counterRef);
    if (snap.exists()) {
      const current  = snap.data().count || 0;
      const newCount = current + 1;
      await updateDoc(counterRef, { count: newCount });
      return newCount;
    } else {
      await setDoc(counterRef, { count: 1 });
      return 1;
    }
  } catch (err) {
    console.error("Erro no contador:", err);
    return 0;
  }
}
