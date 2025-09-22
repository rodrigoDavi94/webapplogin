import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Principal from './pages/Principal';
import { useAuth } from './contexts/AuthContext';

const PrivateRouteWrapper = () => {
  const { currentUser } = useAuth();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (checking) {
    return <div>Verificando autenticação...</div>;
  }
  
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRouteWrapper = () => {
  const { currentUser } = useAuth();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (checking) {
    return <div>Verificando autenticação...</div>;
  }
  
  return !currentUser ? <Outlet /> : <Navigate to="/principal" />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    element: <PublicRouteWrapper />,
    children: [
      {
        path: '/cadastro',
        element: <Cadastro />
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
  {
    element: <PrivateRouteWrapper />,
    children: [
      {
        path: '/principal',
        element: <Principal />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);

export default router;