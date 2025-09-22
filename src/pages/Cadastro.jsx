import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validação básica
    if (!email || !senha || !nome || !sobrenome || !dataNascimento) {
      return setError('Todos os campos são obrigatórios');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await signup(email, senha, nome, sobrenome, dataNascimento);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Falha ao criar conta');
      }
    } catch (error) {
      setError('Falha ao criar conta: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Cadastro de Usuário</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Cadastro realizado com sucesso! Redirecionando para o login...</div>}
      
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
        
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="sobrenome">Sobrenome:</label>
          <input
            type="text"
            id="sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dataNascimento">Data de Nascimento:</label>
          <input
            type="date"
            id="dataNascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      
      <div className="link-container">
        Já possui uma conta? <Link to="/login">Faça login</Link>
      </div>
    </div>
  );
}

export default Cadastro;