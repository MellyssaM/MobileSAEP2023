import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.147:3000'
axios.defaults.baseURL = uri

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [alertData, setAlertData] = useState<{ title: string; message: string } | null>(null)

  function handleLogin() {
    axios.post('/login', { email, senha })
      .then(response => { return { status: response.status, response: response.data } })
      .then(({ status, response }) => {
        if (status === 200) {
          setAlertData({ title: 'Sucesso', message: 'Login realizado com sucesso!' })
          window.localStorage.setItem('professor', JSON.stringify(response))
          setTimeout(() => {
            navigate('/home')
          }, 1000)
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 401) {
          setAlertData({ title: 'Erro', message: 'Falha no login. Verifique suas credenciais.' })
          return
        }
        setAlertData({ title: 'Erro', message: 'Erro ao conectar com o servidor. Tente novamente mais tarde.' })
      })
  }

    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 via-orange-200 to-yellow-100">
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="w-full max-w-md">
          <Card className="w-full border-0 shadow-xl rounded-3xl bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-0">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center shadow-md mb-2">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold text-orange-700 tracking-tight">Bem-vindo!</CardTitle>
                <p className="text-sm text-orange-500">Acesse sua conta para continuar</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              {alertData && (
                <Alert className="bg-orange-100 border-orange-300 text-orange-700">
                  <AlertTitle>{alertData.title}</AlertTitle>
                  <AlertDescription>{alertData.message}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50/60 placeholder-orange-400"
                  required
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                  className="w-full border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50/60 placeholder-orange-400"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-orange-300 text-white font-semibold py-2 rounded-xl shadow hover:from-orange-500 hover:to-orange-400 transition-colors duration-300">
                Entrar
              </Button>
            </CardContent>
          </Card>
        </form>
      </main>
    )
}

export default Login
