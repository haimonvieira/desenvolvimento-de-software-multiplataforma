// Importando os hooks useState e useEffect
import { useState, useEffect } from "react";
// Importando o useRouter para navegar entre as páginas
import Link from "next/link";
// Importando a biblioteca Axios
import axios from "axios";
import Loading from "../Loading";

const HomeContent = () => {
  // Estado para armazenar a lista retornada pela nossa API
  const [empresas, setEmpresas] = useState([]);
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(true);
  // Estado para controlar uma possível mensagem de erro
  const [erro, setErro] = useState(false);
  // Estado para pesquisar empresas no catálogo
  const [pesquisa, setPesquisa] = useState("");

  // useEffect para buscar a lista quando o componente carregar
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get(
          "https://brasilapi.com.br/api/cvm/corretoras/v1"
        );
        setEmpresas(response.data);
      } catch (error) {
        console.log(error);
        setErro(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  // Filtrando as empresas usando a pesquisa digitada pelo usuário
  const empresasFiltradas = empresas.filter((empresa) => {
    const texto = pesquisa.toLowerCase();
    const nome = (empresa.nome_comercial || empresa.nome_social || "").toLowerCase();
    const cnpj = (empresa.cnpj || "").toLowerCase();

    return nome.includes(texto) || cnpj.includes(texto);
  });

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-lg sm:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-300">
          DW3 • React + Next.js + Axios
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Catálogo de Empresas</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
          Empresas disponibilizadas pela nossa API. Clique em um card para consultar
          os dados completos da empresa pelo CNPJ.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Catálogo</p>
            <h2 className="text-2xl font-bold text-slate-900">Lista de empresas</h2>
            <p className="mt-1 text-sm text-slate-500">
              {empresasFiltradas.length} empresa(s) encontrada(s)
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <label htmlFor="pesquisa" className="mb-1 block text-sm font-medium text-slate-700">
              Pesquisar
            </label>
            <input
              type="text"
              id="pesquisa"
              placeholder="Nome ou CNPJ"
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <Loading loading={loading} />

        {!loading && erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
            Não foi possível carregar as empresas. Tente novamente em instantes.
          </div>
        )}

        {!loading && !erro && empresasFiltradas.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Nenhuma empresa encontrada.
          </div>
        )}

        {!loading && !erro && empresasFiltradas.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {empresasFiltradas.map((empresa) => (
              <Link
                key={empresa.cnpj}
                href={`/empresa/${empresa.cnpj}`}
                className="group block rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-700">
                    {empresa.uf || "BR"}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {empresa.status || "Não informado"}
                  </span>
                </div>

                <h3 className="line-clamp-2 min-h-14 text-lg font-bold text-slate-900 group-hover:text-blue-700">
                  {empresa.nome_comercial || empresa.nome_social}
                </h3>

                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">
                  {empresa.nome_social}
                </p>

                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">CNPJ:</span> {empresa.cnpj}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Local:</span>{" "}
                    {empresa.municipio || "Não informado"} - {empresa.uf || "--"}
                  </p>
                </div>

                <span className="mt-5 block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-blue-700">
                  Ver detalhes
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeContent;
