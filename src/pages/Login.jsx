import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !senha) {
      return setError('E-mail e senha são obrigatórios');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await login(email, senha);
      
      if (result.success) {
        navigate('/principal');
      } else {
        setError('Usuário não cadastrado ou credenciais inválidas');
      }
    } catch (error) {
      setError('Falha ao fazer login: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '16px', color: '#333' }}>
        Rodrigo Davi
      </p>
      <div className="container">
        <h2>Login</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <div className="link-container">
        Não possui uma conta? <Link to="/cadastro">Cadastre-se</Link>
      </div>
      </div>
    </div>
  );
}

export default Login;