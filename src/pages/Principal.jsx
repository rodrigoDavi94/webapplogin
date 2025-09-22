import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Principal() {
  const { currentUser, userData, logout, fetchUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserData() {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Se os dados do usuário já estão carregados, não precisa buscar novamente
      if (userData) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await fetchUserData(currentUser.uid);
      } catch (error) {
        setError('Erro ao carregar dados do usuário: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [currentUser, userData, navigate]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Falha ao fazer logout: ' + error.message);
    }
  }

  // Formatar a data de nascimento
  const formatarData = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="loading">Carregando dados do usuário...</div>;
  }

  return (
    <div className="container">
      <h2>Página Principal</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {userData ? (
        <div className="user-info">
          <h3>Dados do Usuário</h3>
          
          <div className="info-item">
            <strong>Nome:</strong> {userData.nome}
          </div>
          
          <div className="info-item">
            <strong>Sobrenome:</strong> {userData.sobrenome}
          </div>
          
          <div className="info-item">
            <strong>Data de Nascimento:</strong> {formatarData(userData.dataNascimento)}
          </div>
          
          <div className="info-item">
            <strong>E-mail:</strong> {userData.email}
          </div>
        </div>
      ) : (
        <div className="no-data">Nenhum dado de usuário encontrado.</div>
      )}
      
      <button onClick={handleLogout} className="logout-button">
        Sair
      </button>
    </div>
  );
}

export default Principal;