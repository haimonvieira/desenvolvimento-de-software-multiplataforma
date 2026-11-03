import Head from "next/head";
import Container from "@/components/Container";
import DetailsContent from "@/components/DetailsContent";

export default function Empresa() {
  return (
    <>
      <Head>
        <title>Certidão de Registro</title>
        <meta
          name="description"
          content="Consulta dos dados completos de uma empresa pelo CNPJ"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <Container>
          <DetailsContent />
        </Container>
      </main>
    </>
  );
}
