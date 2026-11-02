import Head from "next/head";
import Container from "@/components/Container";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <>
      <Head>
        <title>Catálogo de Empresas</title>
        <meta
          name="description"
          content="Catálogo de empresas consumindo uma API em Node.js e Express"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <Container>
          <HomeContent />
        </Container>
      </main>
    </>
  );
}
