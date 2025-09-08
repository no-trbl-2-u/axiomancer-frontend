import styled from "@emotion/styled"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { Link, useNavigate, useLocation } from "react-router-dom"
import LoadingScreen from "../../components/LoadingScreen"
import { InitializationStep } from "../../services/gameInitializationAPI"

const LoginContainer = styled.div`
  height: 100vh;
  background-image: url('/images/title-screen.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    margin: 0;
    background-color: rgba(0, 0, 0, 0.75);
    width: 50%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin: 0;
  padding: 1.5rem;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LoginFormContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 24rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.75rem 1rem;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;


function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const { runLoginUser, loginStatus, loginError, isLoggedIn, hasCharacter } = useAuth()
  
  // Get the intended destination from the location state (set by ProtectedRoute)
  const from = (location.state as any)?.from || null

  // Redirect based on login status and character existence
  useEffect(() => {
    if (isLoggedIn) {
      if (from) {
        // User was redirected here from a protected route, send them back
        navigate(from, { replace: true })
      } else if (hasCharacter) {
        navigate('/character-select') // User has character, go to character selection screen
      } else {
        navigate('/character-create') // User needs to create character
      }
    }
  }, [isLoggedIn, hasCharacter, navigate, from])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmedUsername = username.trim()
    if (!trimmedUsername || !password) return
    runLoginUser({ username: trimmedUsername, password }).catch(() => { })
  }

  // Show loading screen during login process
  if (loginStatus === 'pending' as any) {
    // Create mock initialization steps for display during login
    const mockSteps: InitializationStep[] = [
      { name: 'authentication', description: 'Authenticating user...', completed: false },
      { name: 'character', description: 'Loading character data...', completed: false },
      { name: 'gameState', description: 'Loading game state...', completed: false },
      { name: 'world', description: 'Initializing world...', completed: false },
    ];
    
    return (
      <LoadingScreen 
        steps={mockSteps} 
        currentMessage="Entering the realm of logic and reason..."
        progress={25} // Mock progress
      />
    );
  }

  return (
    <LoginContainer>
      <Header>
        <Title>Axiomancer</Title>
      </Header>

      <MainContent>
        <LoginFormContainer>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>

            {loginError ? (
              <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{String((loginError as Error).message || 'Something went wrong')}</div>
            ) : null}

            <Button type="submit" disabled={loginStatus === 'pending' as any}>
              {loginStatus === 'pending' as any ? 'Submitting…' : 'Login'}
            </Button>

            <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Don’t have an account? <Link to="/register" style={{ color: '#93c5fd' }}>Register</Link>
            </div>
          </Form>
        </LoginFormContainer>
      </MainContent>
    </LoginContainer>
  )
}

export default LoginPage;