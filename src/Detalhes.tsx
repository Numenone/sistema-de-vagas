import type { VagaType } from "./utils/VagaType"
import { useParams, Link } from "react-router-dom"
import { CardVaga } from "./component/CardVaga"
import { useEffect, useState } from "react"
import { useUsuarioStore } from "./context/UsuarioContext"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import React from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  descricao: string
}

export default function Detalhes() {
  const params = useParams()
  const [vagaPrincipal, setVagaPrincipal] = useState<VagaType | null>(null)
  const [vagasSimilares, setVagasSimilares] = useState<VagaType[]>([])
  const { usuario, fetchAutenticado } = useUsuarioStore()
  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function buscaDados() {
      try {
        // Usa o novo endpoint para buscar uma vaga específica
        const response = await fetch(`${apiUrl}/api/vagas/${params.vagaId}`)
        if (!response.ok) {
          throw new Error('Vaga não encontrada');
        }
        const { vaga, vagasSimilares } = await response.json()
        setVagaPrincipal(vaga)
        setVagasSimilares(vagasSimilares)
      } catch (error) {
        console.error("Erro ao buscar vaga:", error)
        toast.error("Erro ao carregar vaga")
      }
    }
    
    if (params.vagaId) {
      buscaDados()
    }
  }, [params.vagaId])

  async function enviaCandidatura(data: Inputs) {
    try {
        console.log("Enviando candidatura para vaga ID:", params.vagaId);
        console.log("Usuário ID:", usuario.id);
        
        // Usa o novo endpoint para criar a candidatura
        const response = await fetchAutenticado(`${apiUrl}/api/candidaturas`, {
            method: "POST",
            body: JSON.stringify({
                usuarioId: usuario.id,
                vagaId: Number(params.vagaId),
                descricao: data.descricao
            })
        });

        console.log("Status da resposta:", response.status);
        
        if (response.status === 201) {
            const novaCandidatura = await response.json();
            console.log("Candidatura criada:", novaCandidatura);
            
            toast.success("Obrigado. Sua candidatura foi enviada. Aguarde retorno");
            reset();
        } else {
            const erro = await response.text();
            console.error("Erro na resposta:", erro);
            toast.error("Erro... Não foi possível enviar sua candidatura");
        }
    } catch (error) {
        console.error("Erro ao enviar candidatura:", error);
        toast.error("Erro de conexão. Tente novamente.");
    }
}

  if (!vagaPrincipal) {
    return <div className="max-w-7xl mx-auto p-4">Carregando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <section className="flex flex-col mt-6 bg-white border border-gray-200 rounded-lg shadow md:flex-row">
        <img className="object-contain w-full md:w-1/3 rounded-t-lg md:rounded-s-lg p-4 bg-white"
          src={vagaPrincipal.empresa.logo || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU3ZWIiLz48dGV4dCB4PSIxMDAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NzY4NkEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvZ28gTMOjbyBEaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4="} 
          alt={`Logo da ${vagaPrincipal.empresa.nome}`}
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU3ZWIiLz48dGV4dCB4PSIxMDAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NzY4NkEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvZ28gTMOjbyBEaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4=";
          }}
        />
        <div className="flex flex-col justify-between p-6 leading-normal w-full md:w-2/3">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {vagaPrincipal.titulo}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900">
            Empresa: <Link to={`/empresas/${vagaPrincipal.empresa.id}`} className="text-blue-600 hover:underline">
              {vagaPrincipal.empresa.nome}
            </Link>
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900">
            Salário R$: {Number(vagaPrincipal.salario).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </h5>
          <p className="mb-3 font-normal text-gray-700">
            {vagaPrincipal.descricao}
          </p>
          <h6 className="mb-2 text-lg font-bold tracking-tight text-gray-900">
            Requisitos:
          </h6>
          <p className="mb-3 font-normal text-gray-700">
            {vagaPrincipal.requisitos}
          </p>
          
          {usuario.id && usuario.tipo === 'candidato' ? (
            <>
              <h3 className="text-xl font-bold tracking-tight text-gray-900">
                🙂 Você pode se candidatar a esta vaga!
              </h3>
              <form onSubmit={handleSubmit(enviaCandidatura)} className="mt-4">
                <input 
                  type="text" 
                  className="mb-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" 
                  value={`${usuario.nome} (${usuario.email})`} 
                  disabled 
                  readOnly 
                />
                <textarea 
                  className="mb-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva por que você é adequado para esta vaga"
                  rows={4}
                  required
                  {...register("descricao")}
                />
                <button 
                  type="submit" 
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Enviar Candidatura
                </button>
              </form>
            </>
          ) : usuario.id ? (
            <h2 className="mb-2 text-xl tracking-tight text-gray-900">
              ⚠️ Apenas candidatos podem se inscrever nas vagas
            </h2>
          ) : (
            <h2 className="mb-2 text-xl tracking-tight text-gray-900">
              😎 Gostou? Faça login como candidato para se inscrever!
            </h2>
          )}
        </div>
      </section>

      {vagasSimilares.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Vagas Similares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vagasSimilares.map(vaga => (
              <CardVaga key={vaga.id} data={vaga} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}