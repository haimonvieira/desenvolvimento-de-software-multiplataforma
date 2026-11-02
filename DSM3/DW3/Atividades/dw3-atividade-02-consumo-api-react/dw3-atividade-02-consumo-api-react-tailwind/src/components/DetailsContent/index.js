// Importando os hooks useState e useEffect
import { useState, useEffect } from "react";
// Importando o useRouter para receber o CNPJ e voltar ao catálogo
import { useRouter } from "next/router";
// Importando a biblioteca Axios
import axios from "axios";
import Loading from "../Loading";

const DetailsContent = () => {
  const router = useRouter();
  const { cnpj } = router.query;

  // Estado para armazenar os dados de uma empresa
  const [empresa, setEmpresa] = useState(null);
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(true);
  // Estado para armazenar mensagem de erro
  const [erro, setErro] = useState("");

  // useEffect para buscar uma empresa pelo CNPJ recebido na rota
  useEffect(() => {
    if (!cnpj) {
      return;
    }

    const fetchEmpresa = async () => {
      try {
        const response = await axios.get(
          `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
        );

        setEmpresa(response.data);
      } catch (error) {
        console.log(error);

        if (error.response && error.response.status === 404) {
          setErro("CNPJ não encontrado.");
        } else {
          setErro("Não foi possível consultar a empresa.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [cnpj]);

  // Função simples para transformar true/false em Sim/Não
  const simOuNao = (valor) => {
    if (valor === true) {
      return "Sim";
    }

    if (valor === false) {
      return "Não";
    }

    return "Não informado";
  };

  // Função para voltar ao catálogo
  const voltar = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-8">
      <div className="mx-auto flex min-h-full max-w-5xl items-start justify-center">
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Consulta de CNPJ
              </p>
              <h1 className="text-xl font-bold text-slate-900">Detalhes da empresa</h1>
            </div>

            <button
              type="button"
              onClick={voltar}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-2xl leading-none text-slate-600 transition hover:bg-slate-200"
              aria-label="Fechar"
            >
              &times;
            </button>
          </div>

          <div className="p-5 sm:p-7">
            <Loading loading={loading} />

            {!loading && erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                <h2 className="font-bold">Erro na consulta</h2>
                <p className="mt-1 text-sm">{erro}</p>
                <button
                  type="button"
                  onClick={voltar}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Voltar ao catálogo
                </button>
              </div>
            )}

            {!loading && !erro && empresa && (
              <div>
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">{empresa.cnpj}</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                      {empresa.nome_fantasia || empresa.razao_social}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">{empresa.razao_social}</p>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {empresa.descricao_situacao_cadastral || "Não informado"}
                  </span>
                </div>

                <section className="mt-6">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Dados cadastrais</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Info label="CNPJ" value={empresa.cnpj} />
                    <Info label="Porte" value={empresa.porte} />
                    <Info
                      label="Matriz / Filial"
                      value={empresa.descricao_identificador_matriz_filial}
                    />
                    <Info label="Início da atividade" value={empresa.data_inicio_atividade} />
                    <Info
                      label="Situação cadastral"
                      value={empresa.descricao_situacao_cadastral}
                    />
                    <Info label="Data da situação" value={empresa.data_situacao_cadastral} />
                    <Info
                      label="Natureza jurídica"
                      value={empresa.codigo_natureza_juridica}
                    />
                    <Info
                      label="Capital social"
                      value={
                        empresa.capital_social !== null &&
                        empresa.capital_social !== undefined
                          ? Number(empresa.capital_social).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "Não informado"
                      }
                    />
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Atividade principal</h3>
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">CNAE {empresa.cnae_fiscal}</p>
                    <p className="mt-1">{empresa.cnae_fiscal_descricao || "Não informado"}</p>
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Endereço e contato</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Info
                      label="Endereço"
                      value={`${empresa.descricao_tipo_de_logradouro || ""} ${empresa.logradouro || ""}, ${empresa.numero || "S/N"}`}
                    />
                    <Info label="Complemento" value={empresa.complemento} />
                    <Info label="Bairro" value={empresa.bairro} />
                    <Info
                      label="Cidade"
                      value={`${empresa.municipio || "Não informado"} - ${empresa.uf || "--"}`}
                    />
                    <Info label="CEP" value={empresa.cep} />
                    <Info label="Telefone" value={empresa.ddd_telefone_1} />
                    <Info label="E-mail" value={empresa.email} />
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Opções tributárias</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Info label="Simples Nacional" value={simOuNao(empresa.opcao_pelo_simples)} />
                    <Info label="MEI" value={simOuNao(empresa.opcao_pelo_mei)} />
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Quadro de sócios e administradores
                  </h3>

                  {!empresa.qsa || empresa.qsa.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      Não há sócios informados.
                    </p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {empresa.qsa.map((socio, index) => (
                        <div key={index} className="rounded-xl border border-slate-200 p-4">
                          <h4 className="font-bold text-slate-900">{socio.nome_socio}</h4>
                          <p className="mt-2 text-sm text-slate-600">
                            Qualificação: {socio.qualificacao_socio || "Não informado"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Entrada: {socio.data_entrada_sociedade || "Não informado"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Atividades secundárias
                  </h3>

                  {!empresa.cnaes_secundarios || empresa.cnaes_secundarios.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      Não há atividades secundárias informadas.
                    </p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {empresa.cnaes_secundarios.map((atividade, index) => (
                        <div key={index} className="rounded-xl border border-slate-200 p-4">
                          <h4 className="font-bold text-slate-900">CNAE {atividade.codigo}</h4>
                          <p className="mt-1 text-sm text-slate-600">{atividade.descricao}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <button
                    type="button"
                    onClick={voltar}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Voltar ao catálogo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "Não informado"}
      </p>
    </div>
  );
};

export default DetailsContent;
