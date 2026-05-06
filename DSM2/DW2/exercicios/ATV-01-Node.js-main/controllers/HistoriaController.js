import express from 'express';
const router = express.Router();

router.get('/historia', function (req, res){

    const historias = [
        {
            tecnologia: "Máquina Enigma",
            ano: "Década de 1920 - 1945",
            significado: "Cifra mecânica de rotor definidora usada pelas forças alemãs. Sua quebra em Bletchley Park encurtou a Segunda Guerra Mundial e deu origem à computação moderna.",
            statusAtual: "obsoleto",
            cor: 'bg-danger',
            icone: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00e5ff"><path d="M280-240v-480h80v480h-80ZM440-80v-800h80v800h-80ZM120-400v-160h80v160h-80Zm480 160v-480h80v480h-80Zm160-160v-160h80v160h-80Z"/></svg>`
        },
        {
            tecnologia: "PGP (Pretty Good Privacy)",
            ano: "1991",
            significado: `Phil Zimmermann democratizou a criptografia para o público, desencadeando as "Guerras Criptográficas" e provando que software é liberdade de expressão.`,
            statusAtual: "suporte de legado",
            cor: 'bg-warning',
            icone: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00e5ff"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>`
        },
        {
            tecnologia: "SSL 1.0 (Netscape)",
            ano: "1994",
            significado: "A base do comércio web. O SSL 1.0 nunca foi lançado publicamente devido as falhas, mas abriu  caminho para TLS.",
            statusAtual: "comprometido",
            cor: 'bg-danger',
            icone: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00e5ff"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-7-.5-14.5T799-507q-5 29-27 48t-52 19h-80q-33 0-56.5-23.5T560-520v-40H400v-80q0-33 23.5-56.5T480-720h40q0-23 12.5-40.5T563-789q-20-5-40.5-8t-42.5-3q-134 0-227 93t-93 227h200q66 0 113 47t47 113v40H400v110q20 5 39.5 7.5T480-160Z"/></svg>`
        },
        {
            tecnologia: "Bloco Gênesis do Bitcoin",
            ano: "2009",
            significado: "A implementação prática de Proof-of-Work e Criptografia de Curva Elíptica para finanças descentralizadas.",
            statusAtual: "operacional",
            cor: 'bg-success',
            icone: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00e5ff"><path d="M360-120v-80H240v-80h80v-400h-80v-80h120v-80h80v80h80v-80h80v85q52 14 86 56.5t34 98.5q0 29-10 55.5T682-497q35 21 56.5 57t21.5 80q0 66-47 113t-113 47v80h-80v-80h-80v80h-80Zm40-400h160q33 0 56.5-23.5T640-600q0-33-23.5-56.5T560-680H400v160Zm0 240h200q33 0 56.5-23.5T680-360q0-33-23.5-56.5T600-440H400v160Z"/></svg>`
        },
        {
            tecnologia: "Ameaça Pós-Quântica",
            ano: "Década de 2020 - Futuro",
            significado: "O algoritmo de Shor ameaça os padrões atuais RSA e ECC. O NIST está padronizando cifras 'baseadas em rede' (Lattice-based) para defesa.",
            statusAtual: "em transição",
            cor: 'bg-secondary',
            icone: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00e5ff"><path d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Zm0-80h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>`
        },

    ];

    res.render('historia', {historias});

});

export default router;