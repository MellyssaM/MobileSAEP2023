import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from 'axios'

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.147:3000'
axios.defaults.baseURL = uri

function Home() {
  const navigate = useNavigate()
  const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')
  const [turmas, setTurmas] = useState<Array<{ id: number; nome: string }>>([])
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!professor.id) {
      sair()
      return
    }
    axios.get('/turma/' + professor.id)
      .then(response => { setTurmas(response.data) })
      .catch(error => {
        console.error('Erro ao buscar turmas:', error)
      })
  }, [])

  function sair() {
    window.localStorage.removeItem('professor')
    navigate('/login')
  }

  function excluir(turmaId: number) {
    axios.delete('/turma/' + turmaId)
      .then(response => { return { status: response.status, response: response.data } })
      .then(({ status }) => {
        if (status == 204) {
          setTurmas(turmas.filter(turma => turma.id !== turmaId))
          return
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 409) {
          alert(error?.response.data?.message || 'Falha ao excluir turma.')
          return
        }
      })
  }

    return (
  <>
    <header className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md flex items-center justify-between px-8 h-16">
      <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-sm">{professor.nome}</h1>
      <Button
        variant="destructive"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 shadow-md"
        onClick={sair}
      >
        Sair
      </Button>
    </header>

    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-orange-700">Minhas turmas</h2>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded-lg px-5 py-2 shadow-md transition-all duration-300">
                + Nova turma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-orange-50 border border-orange-200 rounded-2xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-orange-700 text-lg font-bold">
                  Cadastrar nova turma
                </DialogTitle>
                <DialogDescription className="text-orange-600">
                  Preencha o nome da turma e clique em “Salvar”.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const professorId = Number(professor?.id);
                  if (!professorId) {
                    alert("Professor inválido. Faça login novamente.");
                    return;
                  }
                  setSubmitting(true);
                  axios
                    .post("/turma", { nome, professorId })
                    .then(() => {
                      setNome("");
                      setOpen(false);
                      return axios.get("/turma/" + professorId);
                    })
                    .then((response) => {
                      if (response) setTurmas(response.data);
                    })
                    .catch((error) => {
                      console.error("Erro ao cadastrar turma:", error);
                      alert(
                        error?.response?.data?.message ||
                          "Erro ao cadastrar turma"
                      );
                    })
                    .finally(() => setSubmitting(false));
                }}
                className="space-y-4 mt-2"
              >
                <Input
                  type="text"
                  placeholder="Nome da turma"
                  value={nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNome(e.target.value)
                  }
                  className="border border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50/80 placeholder-orange-400 rounded-lg"
                  required
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={submitting || !nome.trim()}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg px-5 py-2 transition-all duration-300 shadow-sm"
                  >
                    {submitting ? "Enviando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <ul className="space-y-3">
          {turmas.map((turma) => (
            <li
              key={turma.id}
              className="flex justify-between items-center bg-white border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              <span className="text-orange-800 font-medium">
                {turma.id} — {turma.nome}
              </span>
              <div className="flex gap-2">
                <Button
                  className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg px-4 py-1.5"
                  onClick={() => excluir(turma.id)}
                >
                  Excluir
                </Button>
                <Button
                  className="bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg px-4 py-1.5"
                  onClick={() =>
                    navigate("/atividades", {
                      state: { turmaId: turma.id, nome: turma.nome },
                    })
                  }
                >
                  Visualizar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  </>
);

}

export default Home
