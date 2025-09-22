// Importando os módulos necessários do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA-YyMpsZg5k5nrHGUalMJXg_aD73Q5cFU",
  authDomain: "webapp-cb306.firebaseapp.com",
  projectId: "webapp-cb306",
  storageBucket: "webapp-cb306.appspot.com",
  messagingSenderId: "931461049699",
  appId: "1:931461049699:web:xxxxxxxxxxxxxxxxxxxxxxxx"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Exportando os serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;