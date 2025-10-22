import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
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

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.147:3000'
axios.defaults.baseURL = uri

function Atividades() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const id = state?.turmaId || ''
  const turma = state?.nome || ''
  const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')
  const [atividades, setAtividades] = useState<Array<{ id: number; descricao: string }>>([])

  const [open, setOpen] = useState(false)
  const [descricao, setDescricao] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!professor.id) {
      window.localStorage.removeItem('professor')
      sair()
      return
    }
    loadAtividades()
  }, [])

  function loadAtividades() {
    axios.get('/atividade/' + id)
      .then(response => { setAtividades(response.data) })
      .catch(error => {
        console.error('Erro ao buscar atividades:', error)
      })
  }

  function sair() {
    navigate('/home')
  }

    return (
  <>
    <header className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white flex items-center justify-between px-8 h-16 shadow-md">
      <h1 className="text-2xl font-bold tracking-wide drop-shadow-sm">
        {professor.nome}
      </h1>
      <Button
        variant="destructive"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-5 py-2 shadow-md transition-all duration-300"
        onClick={sair}
      >
        Sair
      </Button>
    </header>

    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-orange-700">
            Atividades — <span className="text-orange-500">{turma}</span>
          </h2>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded-lg px-5 py-2 shadow-md transition-all duration-300">
                + Nova atividade
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-orange-50 border border-orange-200 rounded-2xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-orange-700 text-lg font-bold">
                  Cadastrar nova atividade
                </DialogTitle>
                <DialogDescription className="text-orange-600">
                  Digite a descrição da atividade para a turma selecionada.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const turmaId = Number(id);
                  if (!turmaId) {
                    console.error("turmaId inválido");
                    return;
                  }
                  setSubmitting(true);
                  axios
                    .post("/atividade", { descricao, turmaId })
                    .then(() => {
                      setDescricao("");
                      setOpen(false);
                      loadAtividades();
                    })
                    .catch((error) => {
                      console.error("Erro ao cadastrar atividade:", error);
                    })
                    .finally(() => setSubmitting(false));
                }}
                className="space-y-4 mt-2"
              >
                <Input
                  type="text"
                  placeholder="Descrição da atividade"
                  value={descricao}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDescricao(e.target.value)
                  }
                  className="border border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50/80 placeholder-orange-400 rounded-lg"
                  required
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={submitting || !descricao.trim()}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg px-5 py-2 transition-all duration-300 shadow-sm"
                  >
                    {submitting ? "Enviando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-orange-700 mb-4">
            Lista de atividades
          </h3>

          {atividades.length === 0 ? (
            <p className="text-orange-600 italic">Nenhuma atividade cadastrada.</p>
          ) : (
            <ul className="space-y-3">
              {atividades.map((atividade) => (
                <li
                  key={atividade.id}
                  className="flex justify-between items-center bg-orange-50 border border-orange-200 rounded-lg p-3 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-orange-800 font-medium">
                    {atividade.id} — {atividade.descricao}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  </>
);

}

export default Atividades
