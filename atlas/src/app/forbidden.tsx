import Link from "next/link";

export default function Forbidden() {
  return (
    <main>
      <h1>403 — Proibido</h1>
      <p>Esta página exige uma sessão autorizada como proprietário do Atlas.</p>
      <p>
        É o proprietário? Entre com a conta GitHub configurada em{" "}
        <a href="/admin/entrar">/admin/entrar</a> para autorizar a administração.
      </p>
      <p><Link href="/">Voltar ao atlas</Link></p>
    </main>
  );
}
