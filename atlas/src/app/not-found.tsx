import Link from "next/link";

export default function NotFound() {
  return (
    <main className="public-page public-empty">
      <h1>Página não encontrada</h1>
      <p>
        O endereço acessado não existe no atlas. Volte ao mapa e escolha uma
        linha do semestre.
      </p>
      <p>
        <Link href="/">Voltar ao atlas</Link>
      </p>
    </main>
  );
}
