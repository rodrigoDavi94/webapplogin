import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Criando o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor do contexto de autenticação
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para cadastrar um novo usuário
  async function signup(email, password, nome, sobrenome, dataNascimento) {
    try {
      // Criando usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Salvando dados adicionais no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        sobrenome,
        dataNascimento,
        email,
        uid: user.uid
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Função para fazer login
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Função para fazer logout
  function logout() {
    return signOut(auth);
  }

  // Função para buscar dados do usuário no Firestore
  const fetchUserData = useCallback(async (uid) => {
    try {
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        return docSnap.data();
      } else {
        console.log("Nenhum documento encontrado!");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  }, []);

  // Efeito para monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Valores a serem disponibilizados pelo contexto
  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}