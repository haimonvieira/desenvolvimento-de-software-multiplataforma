import Head from "next/head";
import DetailsContent from "@/components/DetailsContent";

export default function Empresa() {
  return (
    <>
      <Head>
        <title>Detalhes da Empresa</title>
        <meta
          name="description"
          content="Consulta dos dados completos de uma empresa pelo CNPJ"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <DetailsContent />
      </main>
    </>
  );
}
