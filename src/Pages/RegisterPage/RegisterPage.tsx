import styled from "@emotion/styled"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAsync } from "../../hooks/useAsync";

interface CreateUserOptions {
    username: string
    email: string
    password: string
}

const RegisterContainer = styled.div`
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

const RegisterFormContainer = styled.div`
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
  background-color: #10b981;
  color: white;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #34d399;
  }
`;

function RegisterPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    async function createUser(createUserOptions: CreateUserOptions) {
        const response = await fetch('http://localhost:8080/api/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, email: email, password: password })
        })
        if (!response.ok) {
            const text = await response.text()
            console.log("text", text)
            console.log("response", response)
            throw new Error(text || `Request failed with ${response.status}`)
        }
        try {
            return await response.json()
        } catch {
            return {}
        }
    }

    const { status, error, run } = useAsync(createUser)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!username || !password || password !== confirmPassword || !email) {
            return
        }

        run({ username: username.trim(), email: email, password: password }).catch(() => { })
    }

    return (
        <RegisterContainer>
            <Header>
                <Title>Create Account</Title>
            </Header>

            <MainContent>
                <RegisterFormContainer>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Choose a username"
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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Please enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormGroup>

                        {error ? (
                            <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{String((error as Error).message || 'Something went wrong')}</div>
                        ) : null}



                        <Button type="submit" disabled={status === 'pending'}>
                            {status === 'pending' ? 'Registering...' : 'Register'}
                        </Button>

                        <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Already have an account? <Link to="/login" style={{ color: '#93c5fd' }}>Log in</Link>
                        </div>
                    </Form>
                </RegisterFormContainer>
            </MainContent>
        </RegisterContainer>
    )
}

export default RegisterPage
