// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set, get } from 'firebase/database';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDa1NHRNOTEm552aMbmx-pKgtJp9m_qbtg",
  authDomain: "react-native-af78e.firebaseapp.com",
  projectId: "react-native-af78e",
  storageBucket: "react-native-af78e.firebasestorage.app",
  messagingSenderId: "250277254654",
  appId: "1:250277254654:web:06f87c99193e863e8f9caf",
  measurementId: "G-KRCNG8S6DT"
};

// Inicializa la app y los servicios
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const auth = getAuth(app);

// Función para obtener países de Europa (ejemplo)
export function fetchEuropeanCountries() {
  fetch('https://restcountries.com/v3.1/region/europe')
    .then(response => response.json())
    .then(data => {
    })
    .catch(error => console.error("Error al obtener países:", error));
}

// Función para registrar un usuario con email y contraseña
export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Registro exitoso
      console.log("Usuario registrado:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error en registro:", error);
      throw error;
    });
}

// Función para iniciar sesión con email y contraseña
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Inicio de sesión exitoso
      console.log("Usuario logueado:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error en inicio de sesión:", error);
      throw error;
    });
}

export async function fetchRecipesFromRealtime() {
  try {
    const recipesRef = ref(realtimeDb, 'Recetas');
    const snapshot = await get(recipesRef);

    if (!snapshot.exists()) {
      console.warn('No hay recetas en Realtime Database');
      return [];
    }

    const data = snapshot.val();
    
    // Convierte el objeto a un array de recetas
    const recipesArray = Object.entries(data).map(([id, recipe]) => ({
      id,
      ...recipe
    }));

    return recipesArray;
  } catch (error) {
    console.error('Error al leer recetas de Realtime Database:', error);
    throw error;
  }
}

export { app, analytics, db, auth, realtimeDb };
