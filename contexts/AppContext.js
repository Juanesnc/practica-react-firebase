// src/contexts/AppContext.js
import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../firebase/firebaseConfig';
import { fetchRecipesFromRealtime } from '../firebase/firebaseConfig';
import { realtimeDb } from '../firebase/firebaseConfig';
import { ref, set } from 'firebase/database';

// Datos iniciales (puedes agregar recetas si lo deseas)
const initialRecipes = [
  {
    //Ingresar Nuevas recetas
  },
];

export const AppContext = React.createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [comments, setComments] = useState({});
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  useEffect(() => {
    // Solo si quieres cargar recetas sin requerir login, quita la condición de `user`.
    // O si quieres que solo carguen tras un login, déjala así.
    if (user) {
      fetchRecipesFromRealtime()
        .then(fetchedRecipes => {
          // FetchedRecipes es un arreglo con todas las recetas de Firestore.
          setRecipes(fetchedRecipes);
        })
        .catch(error => {
          console.error("Error obteniendo recetas:", error);
        });
    }
  }, [user]);

  // useEffect(() => {
  //   initialRecipes.forEach((receta) => {
  //     const recetaRef = ref(realtimeDb, `Recetas/${receta.id}`);
  //     set(recetaRef, receta)
  //       .then(() => console.log(`Receta ${receta.id} guardada en Realtime DB`))
  //       .catch((error) => console.error(`Error en receta ${receta.id}:`, error));
  //   });
  // }, []);

  // Función para iniciar sesión usando Firebase Authentication
  const signIn = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
    } catch (error) {
      alert('Credenciales inválidas');
      console.error("Error en inicio de sesión:", error);
    }
  };

  // Función para registrar usuario usando Firebase Authentication
  const signUp = async (username, email, password) => {
    if (!username || !email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }
    try {
      const userData = await registerUser(email, password);
      // Puedes agregar el username manualmente al objeto del usuario
      setUser({ ...userData, username });
    } catch (error) {
      alert('Error al registrar el usuario: ' + error.message);
      console.error("Error en registro:", error);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  // Funciones para favoritos
  const addFavorite = (recipe) => setFavorites([...favorites, recipe]);
  const removeFavorite = (recipe) => setFavorites(favorites.filter(fav => fav.id !== recipe.id));

  // Funciones para planificador
  const addToPlanner = (recipe) => setPlanner([...planner, recipe]);
  const removeFromPlanner = (recipe) => setPlanner(planner.filter(plan => plan.id !== recipe.id));

  // Función para comentarios
  const addComment = (recipeId, comment) => {
    setComments({
      ...comments,
      [recipeId]: comments[recipeId] ? [...comments[recipeId], comment] : [comment],
    });
  };

  // Función para crear recetas
  const addRecipe = (newRecipe) => setRecipes([...recipes, newRecipe]);

  // Funciones para mostrar/ocultar modal de perfil
  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);

  const appContextValue = {
    user,
    signIn,
    signUp,
    signOut,
    recipes,
    addRecipe,
    favorites,
    addFavorite,
    removeFavorite,
    planner,
    addToPlanner,
    removeFromPlanner,
    comments,
    addComment,
    openProfileModal,
    closeProfileModal,
    profileModalVisible,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
}
