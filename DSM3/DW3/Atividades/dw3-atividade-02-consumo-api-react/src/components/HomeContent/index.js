import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Loading from "../Loading";

const somenteDigitos = (valor) => valor.replace(/\D/g, "");

const formatarCnpj = (valor) => {
  const digitos = somenteDigitos(valor);

  if (digitos.length <= 2) {
    return digitos;
  }

  if (digitos.length <= 5) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2)}`;
  }

  if (digitos.length <= 8) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5)}`;
  }

  if (digitos.length <= 12) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8)}`;
  }

  return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8, 12)}-${digitos.slice(12, 14)}`;
};

const LIMITE_INICIAL = 60;
const LIMITE_INCREMENTO = 60;

const situacaoAtiva = (status) => status === "EM FUNCIONAMENTO NORMAL";

const HomeContent = () => {
  const router = useRouter();

  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  const [cnpj, setCnpj] = useState("");
  const [erroCnpj, setErroCnpj] = useState("");

  const [pesquisa, setPesquisa] = useState("");
  const [visiveis, setVisiveis] = useState(LIMITE_INICIAL);

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

  const handleCnpjChange = (event) => {
    setCnpj(formatarCnpj(event.target.value));

    if (erroCnpj) {
      setErroCnpj("");
    }
  };

  const handleConsultarCnpj = (event) => {
    event.preventDefault();

    const digitos = somenteDigitos(cnpj);

    if (digitos.length !== 14) {
      setErroCnpj("CNPJ incompleto. Digite os 14 números.");
      return;
    }

    router.push(`/empresa/${digitos}`);
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setVisiveis(LIMITE_INICIAL);
  };

  const empresasFiltradas = useMemo(() => {
    const texto = pesquisa.trim().toLowerCase();

    if (!texto) {
      return empresas;
    }

    const digitosPesquisa = somenteDigitos(texto);

    return empresas.filter((empresa) => {
      const nome = (
        empresa.nome_comercial ||
        empresa.nome_social ||
        ""
      ).toLowerCase();
      const cnpjEmpresa = empresa.cnpj || "";

      return (
        nome.includes(texto) ||
        (digitosPesquisa !== "" && cnpjEmpresa.includes(digitosPesquisa))
      );
    });
  }, [empresas, pesquisa]);

  const empresasVisiveis = empresasFiltradas.slice(0, visiveis);
  const total = empresasFiltradas.length;
  const mostrando = empresasVisiveis.length;
  const temMais = total > mostrando;

  return (
    <div>
      <header className="mb-4 sm:mb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="mb-2 font-[family-name:var(--fonte-serif)] text-xs uppercase tracking-[0.04em] text-[var(--dourado)] sm:mb-3">
              BrasilAPI · CVM
            </div>
            <h1 className="font-[family-name:var(--fonte-serif)] text-[26px] font-normal leading-tight text-[var(--tinta)] sm:text-[28px]">
              Catálogo de Empresas
            </h1>
          </div>

          <div
            className="hidden h-[132px] w-[132px] shrink-0 items-center justify-center self-start rounded-full border-[3px] border-[var(--selo)] text-center font-[family-name:var(--fonte-serif)] text-xs font-bold uppercase leading-tight tracking-[0.04em] text-[var(--selo)] -rotate-6 sm:flex"
            aria-hidden="true"
          >
            <span className="block w-24">
              {loading ? "Consultando…" : `${total} registros`}
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end sm:hidden">
          <div
            className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border-[3px] border-[var(--selo)] text-center font-[family-name:var(--fonte-serif)] text-[11px] font-bold uppercase leading-tight tracking-[0.04em] text-[var(--selo)] -rotate-6"
            aria-hidden="true"
          >
            <span className="block w-20">
              {loading ? "Consultando…" : `${total} registros`}
            </span>
          </div>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-end gap-4 border-b border-[var(--dourado)] pb-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="pesquisa"
            className="text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]"
          >
            Buscar no catálogo
          </label>
          <input
            id="pesquisa"
            type="text"
            autoComplete="off"
            placeholder="Nome ou CNPJ"
            value={pesquisa}
            onChange={handlePesquisaChange}
            className="h-10 w-full border border-[var(--campo)] bg-[var(--branco)] px-2.5 text-sm text-[var(--tinta)] placeholder:text-[var(--rotulo)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)] sm:w-[260px]"
          />
        </div>

        <form
          onSubmit={handleConsultarCnpj}
          noValidate
          className="flex flex-col gap-1"
        >
          <label
            htmlFor="cnpj"
            className="text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]"
          >
            Consulta CNPJ
          </label>
          <div className="flex flex-row items-start gap-2">
            <input
              id="cnpj"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={handleCnpjChange}
              maxLength={18}
              aria-invalid={erroCnpj ? "true" : "false"}
              aria-describedby={erroCnpj ? "cnpj-erro" : undefined}
              className="h-10 w-full border border-[var(--campo)] bg-[var(--branco)] px-2.5 text-sm text-[var(--tinta)] placeholder:text-[var(--rotulo)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)] sm:w-[180px]"
            />
            <button
              type="submit"
              className="h-10 shrink-0 bg-[var(--tinta)] px-[18px] text-sm text-[var(--papel)] transition hover:bg-[var(--rotulo)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)]"
            >
              Consultar
            </button>
          </div>
          {erroCnpj && (
            <p
              id="cnpj-erro"
              className="mt-1 text-sm text-[var(--tinta)]"
              role="alert"
            >
              {erroCnpj}
            </p>
          )}
        </form>

        {!loading && pesquisa.trim() && (
          <p
            aria-live="polite"
            className="ml-auto max-w-full truncate font-[family-name:var(--fonte-serif)] text-base text-[var(--tinta)]"
          >
            {total} empresa{total !== 1 ? "s" : ""} encontrada
            {total !== 1 ? "s" : ""} para “{pesquisa.trim()}”
          </p>
        )}
      </div>

      <section aria-busy={loading}>
        <Loading loading={loading} />

        {!loading && erro && (
          <div className="border border-[var(--tinta)] p-5 text-center text-[var(--tinta)]">
            <p className="font-[family-name:var(--fonte-serif)] font-bold">
              Não foi possível carregar os registros.
            </p>
            <p className="mt-1 text-sm">
              Verifique sua conexão e tente novamente em instantes.
            </p>
          </div>
        )}

        {!loading && !erro && total === 0 && (
          <div className="border border-[var(--filete)] p-8 text-center">
            <p className="font-[family-name:var(--fonte-serif)] font-bold text-[var(--tinta)]">
              Nenhuma empresa encontrada.
            </p>
            <p className="mt-1 text-sm text-[var(--rotulo)]">
              Tente outro termo ou consulte o CNPJ diretamente.
            </p>
          </div>
        )}

        {!loading && !erro && total > 0 && (
          <div className="space-y-6">
            <div className="columns-1 gap-x-8 md:columns-2">
              {empresasVisiveis.map((empresa) => (
                <Link
                  key={empresa.cnpj}
                  href={`/empresa/${empresa.cnpj}`}
                  className="group mb-0 block break-inside-avoid border-b border-[var(--filete)] py-3 no-underline focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)]"
                >
                  <div className="flex gap-4 border-b border-dotted border-[var(--filete)] py-1.5 last:border-b-0">
                    <span className="w-[90px] shrink-0 text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]">
                      Nome
                    </span>
                    <span className="flex-1 font-[family-name:var(--fonte-serif)] text-base font-bold text-[var(--tinta)]">
                      {empresa.nome_comercial || empresa.nome_social}
                    </span>
                  </div>
                  {empresa.nome_social &&
                    empresa.nome_social !== empresa.nome_comercial && (
                      <div className="flex gap-4 border-b border-dotted border-[var(--filete)] py-1.5 last:border-b-0">
                        <span className="w-[90px] shrink-0 text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]">
                          Razão social
                        </span>
                        <span className="flex-1 text-sm text-[var(--tinta)]">
                          {empresa.nome_social}
                        </span>
                      </div>
                    )}
                  <div className="flex gap-4 border-b border-dotted border-[var(--filete)] py-1.5 last:border-b-0">
                    <span className="w-[90px] shrink-0 text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]">
                      CNPJ
                    </span>
                    <span className="flex-1 font-[family-name:var(--fonte-mono)] text-sm text-[var(--tinta)]">
                      {empresa.cnpj}
                    </span>
                  </div>
                  <div className="flex gap-4 border-b border-dotted border-[var(--filete)] py-1.5 last:border-b-0">
                    <span className="w-[90px] shrink-0 text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]">
                      Município
                    </span>
                    <span className="flex-1 text-sm text-[var(--tinta)]">
                      {empresa.municipio
                        ? `${empresa.municipio} - ${empresa.uf || ""}`
                        : "Não informado"}
                    </span>
                  </div>
                  <div className="flex gap-4 border-b border-dotted border-[var(--filete)] py-1.5 last:border-b-0">
                    <span className="w-[90px] shrink-0 text-[10px] uppercase tracking-[0.06em] text-[var(--rotulo)]">
                      Situação
                    </span>
                    <span
                      className={`flex-1 text-sm font-medium ${
                        situacaoAtiva(empresa.status)
                          ? "text-[var(--selo)]"
                          : "text-[var(--tinta)]"
                      }`}
                    >
                      {empresa.status || "Não informado"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {temMais && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisiveis((valor) => valor + LIMITE_INCREMENTO)}
                  className="h-10 border border-[var(--campo)] bg-[var(--branco)] px-6 text-sm text-[var(--tinta)] transition hover:border-[var(--tinta)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dourado)]"
                >
                  Mostrar mais ({total - mostrando} restantes)
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeContent;
