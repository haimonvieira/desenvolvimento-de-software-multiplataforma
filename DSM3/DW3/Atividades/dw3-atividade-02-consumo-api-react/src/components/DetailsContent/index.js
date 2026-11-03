import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loading from "../Loading";

const simOuNao = (valor) => {
  if (valor === true) {
    return "Sim";
  }

  if (valor === false) {
    return "Não";
  }

  return "Não informado";
};

const situacaoAtiva = (situacao) =>
  situacao === "ATIVA" || situacao === "EM FUNCIONAMENTO NORMAL";

const DetailsContent = () => {
  const router = useRouter();
  const { cnpj } = router.query;

  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

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
          setErro("Não foi possível consultar o registro.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [cnpj]);

  const voltar = () => {
    router.push("/");
  };

  const situacao = empresa?.descricao_situacao_cadastral || "";

  return (
    <div>
      <button
        type="button"
        onClick={voltar}
        className="mb-6 h-10 border border-[var(--campo)] bg-[var(--branco)] px-4 text-sm text-[var(--tinta)] transition hover:border-[var(--tinta)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)]"
      >
        Voltar ao catálogo
      </button>

      <header className="mb-4 sm:mb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="mb-2 font-[family-name:var(--fonte-serif)] text-xs uppercase tracking-[0.04em] text-[var(--dourado)] sm:mb-3">
              BrasilAPI · Receita Federal
            </div>
            <h1 className="font-[family-name:var(--fonte-serif)] text-[26px] font-normal leading-tight text-[var(--tinta)] sm:text-[28px]">
              Certidão de Registro
            </h1>
          </div>

          <div
            className="hidden h-[132px] w-[132px] shrink-0 items-center justify-center self-start rounded-full border-[3px] text-center font-[family-name:var(--fonte-serif)] text-xs font-bold uppercase leading-tight tracking-[0.04em] -rotate-6 sm:flex"
            style={{
              borderColor: situacaoAtiva(situacao)
                ? "var(--selo)"
                : "var(--tinta)",
              color: situacaoAtiva(situacao)
                ? "var(--selo)"
                : "var(--tinta)",
            }}
            aria-hidden="true"
          >
            <span className="block w-24">
              {loading
                ? "Consultando…"
                : empresa?.descricao_situacao_cadastral || "Não informado"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end sm:hidden">
          <div
            className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border-[3px] text-center font-[family-name:var(--fonte-serif)] text-[11px] font-bold uppercase leading-tight tracking-[0.04em] -rotate-6"
            style={{
              borderColor: situacaoAtiva(situacao)
                ? "var(--selo)"
                : "var(--tinta)",
              color: situacaoAtiva(situacao)
                ? "var(--selo)"
                : "var(--tinta)",
            }}
            aria-hidden="true"
          >
            <span className="block w-20">
              {loading
                ? "Consultando…"
                : empresa?.descricao_situacao_cadastral || "Não informado"}
            </span>
          </div>
        </div>
      </header>

      <Loading loading={loading} />

      {!loading && erro && (
        <div className="border border-[var(--tinta)] p-5 text-[var(--tinta)]">
          <h2 className="font-[family-name:var(--fonte-serif)] font-bold">
            Erro na consulta
          </h2>
          <p className="mt-1 text-sm">{erro}</p>
          <button
            type="button"
            onClick={voltar}
            className="mt-4 h-10 bg-[var(--tinta)] px-4 text-sm text-[var(--papel)] transition hover:bg-[var(--rotulo)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)]"
          >
            Voltar ao catálogo
          </button>
        </div>
      )}

      {!loading && !erro && empresa && (
        <>
          <div className="mb-6 border-b border-[var(--dourado)] pb-5">
            <p className="font-[family-name:var(--fonte-mono)] text-sm text-[var(--rotulo)]">
              {empresa.cnpj}
            </p>
            <h2 className="mt-1 font-[family-name:var(--fonte-serif)] text-2xl font-bold text-[var(--tinta)]">
              {empresa.nome_fantasia || empresa.razao_social}
            </h2>
            {empresa.nome_fantasia && empresa.razao_social && (
              <p className="mt-2 text-sm text-[var(--rotulo)]">
                {empresa.razao_social}
              </p>
            )}
          </div>

          <section className="mb-8">
            <h3 className="mb-4 font-[family-name:var(--fonte-serif)] text-lg font-bold text-[var(--tinta)]">
              Dados cadastrais
            </h3>
            <div className="grid gap-0 border-t border-[var(--filete)] md:grid-cols-2">
              <Info label="CNPJ" value={empresa.cnpj} mono />
              <Info label="Porte" value={empresa.porte} />
              <Info
                label="Matriz / Filial"
                value={empresa.descricao_identificador_matriz_filial}
              />
              <Info
                label="Início da atividade"
                value={empresa.data_inicio_atividade}
              />
              <Info
                label="Situação cadastral"
                value={empresa.descricao_situacao_cadastral}
                destacar={situacaoAtiva(situacao)}
              />
              <Info
                label="Data da situação"
                value={empresa.data_situacao_cadastral}
              />
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
                    : null
                }
              />
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-4 font-[family-name:var(--fonte-serif)] text-lg font-bold text-[var(--tinta)]">
              Atividade principal
            </h3>
            <div className="border-t border-[var(--filete)]">
              <Info label="CNAE" value={empresa.cnae_fiscal} mono />
              <Info label="Descrição" value={empresa.cnae_fiscal_descricao} />
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-4 font-[family-name:var(--fonte-serif)] text-lg font-bold text-[var(--tinta)]">
              Endereço e contato
            </h3>
            <div className="grid gap-0 border-t border-[var(--filete)] md:grid-cols-2">
              <Info
                label="Endereço"
                value={`${empresa.descricao_tipo_de_logradouro || ""} ${empresa.logradouro || ""}, ${empresa.numero || "S/N"}`}
              />
              <Info label="Complemento" value={empresa.complemento} />
              <Info label="Bairro" value={empresa.bairro} />
              <Info
                label="Cidade"
                value={
                  empresa.municipio
                    ? `${empresa.municipio} - ${empresa.uf || "--"}`
                    : null
                }
              />
              <Info label="CEP" value={empresa.cep} mono />
              <Info label="Telefone" value={empresa.ddd_telefone_1} />
              <Info label="E-mail" value={empresa.email} />
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-4 font-[family-name:var(--fonte-serif)] text-lg font-bold text-[var(--tinta)]">
              Opções tributárias
            </h3>
            <div className="grid gap-0 border-t border-[var(--filete)] md:grid-cols-2">
              <Info
                label="Simples Nacional"
                value={simOuNao(empresa.opcao_pelo_simples)}
              />
              <Info label="MEI" value={simOuNao(empresa.opcao_pelo_mei)} />
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-4 font-[family-name:var(--fonte-serif)] text-lg font-bold text-[var(--tinta)]">
              Quadro de sócios e administradores
            </h3>
            {!empresa.qsa || empresa.qsa.length === 0 ? (
              <p className="border-t border-[var(--filete)] py-3 text-sm text-[var(--rotulo)]">
                Não há sócios informados.
              </p>
            ) : (
              <div className="grid gap-0 border-t border-[var(--filete)] md:grid-cols-2">
                {empresa.qsa.map((socio, index) => (
                  <div
                    key={index}
                    className="border-b border-dotted border-[var(--filete)] py-3"
                  >
                    <p className="font-[family-name:var(--fonte-serif)] font-bold text-[var(--tinta)]">
                      {socio.nome_socio || "Não informado"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--rotulo)]">
                      Qualificação: {socio.qualificacao_socio || "Não informado"}
                    </p>
                    <p className="text-sm text-[var(--rotulo)]">
                      Entrada: {socio.data_entrada_sociedade || "Não informado"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-8">
            <h3 className="mb-4 font-[family-name:var(--fonte-serif)] text-lg font-bold text-[var(--tinta)]">
              Atividades secundárias
            </h3>
            {!empresa.cnaes_secundarios ||
            empresa.cnaes_secundarios.length === 0 ? (
              <p className="border-t border-[var(--filete)] py-3 text-sm text-[var(--rotulo)]">
                Não há atividades secundárias informadas.
              </p>
            ) : (
              <div className="grid gap-0 border-t border-[var(--filete)] md:grid-cols-2">
                {empresa.cnaes_secundarios.map((atividade, index) => (
                  <div
                    key={index}
                    className="border-b border-dotted border-[var(--filete)] py-3"
                  >
                    <p className="font-[family-name:var(--fonte-mono)] text-sm text-[var(--tinta)]">
                      CNAE {atividade.codigo}
                    </p>
                    <p className="mt-1 text-sm text-[var(--rotulo)]">
                      {atividade.descricao || "Não informado"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="border-t border-[var(--filete)] pt-6">
            <button
              type="button"
              onClick={voltar}
              className="h-10 bg-[var(--tinta)] px-5 text-sm text-[var(--papel)] transition hover:bg-[var(--rotulo)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)]"
            >
              Voltar ao catálogo
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Info = ({ label, value, mono, destacar }) => {
  const conteudo =
    value === null || value === undefined || String(value).trim() === ""
      ? "Não informado"
      : value;

  return (
    <div className="flex gap-4 border-b border-dotted border-[var(--filete)] py-2.5">
      <span className="w-[110px] shrink-0 text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]">
        {label}
      </span>
      <span
        className={`flex-1 break-words text-sm ${
          mono ? "font-[family-name:var(--fonte-mono)]" : ""
        } ${destacar ? "font-medium text-[var(--selo)]" : "text-[var(--tinta)]"}`}
      >
        {conteudo}
      </span>
    </div>
  );
};

export default DetailsContent;
