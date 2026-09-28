// MASSA DE DADOS - EXERCÍCIOS PRÁTICOS DE MONGODB
// Banco: lojaTech
// Execute este arquivo apenas uma vez em uma base vazia.

use lojaTech

// ==============================
// COLEÇÃO: produtos
// ==============================
db.produtos.insertMany(
[
  {
    "codigo": "PRD001",
    "nome": "Notebook Lenovo IdeaPad 3",
    "categoria": "informatica",
    "descricao": "Notebook para estudos e atividades de escritorio, com SSD e tela de 15,6 polegadas.",
    "preco": 3299.9,
    "estoque": 18,
    "tags": [
      "notebook",
      "estudo",
      "ssd",
      "informatica"
    ],
    "memoria": "8GB",
    "armazenamento": "256GB SSD"
  },
  {
    "codigo": "PRD002",
    "nome": "Mouse Logitech M170",
    "categoria": "perifericos",
    "descricao": "Mouse sem fio compacto para uso cotidiano em computadores e notebooks.",
    "preco": 79.9,
    "estoque": 65,
    "tags": [
      "mouse",
      "sem fio",
      "periferico"
    ]
  },
  {
    "codigo": "PRD003",
    "nome": "Teclado Redragon Kumara",
    "categoria": "perifericos",
    "descricao": "Teclado mecanico compacto voltado para produtividade e jogos.",
    "preco": 249.9,
    "estoque": 34,
    "tags": [
      "teclado",
      "mecanico",
      "periferico",
      "gamer"
    ],
    "layout": "ABNT2"
  },
  {
    "codigo": "PRD004",
    "nome": "Monitor LG 24MP400",
    "categoria": "monitores",
    "descricao": "Monitor de 24 polegadas Full HD indicado para trabalho, estudo e entretenimento.",
    "preco": 749.9,
    "estoque": 22,
    "tags": [
      "monitor",
      "full hd",
      "24 polegadas"
    ],
    "tamanho_tela": "24"
  },
  {
    "codigo": "PRD005",
    "nome": "SSD Kingston NV2 1TB",
    "categoria": "armazenamento",
    "descricao": "Unidade SSD NVMe de alto desempenho para computadores e notebooks compativeis.",
    "preco": 429.9,
    "estoque": 41,
    "tags": [
      "ssd",
      "nvme",
      "1tb",
      "armazenamento"
    ],
    "capacidade": "1TB"
  },
  {
    "codigo": "PRD006",
    "nome": "HD Externo Seagate 2TB",
    "categoria": "armazenamento",
    "descricao": "Disco externo USB para backup e transporte de arquivos.",
    "preco": 489.9,
    "estoque": 28,
    "tags": [
      "hd externo",
      "backup",
      "2tb",
      "armazenamento"
    ],
    "capacidade": "2TB"
  },
  {
    "codigo": "PRD007",
    "nome": "Webcam Logitech C920",
    "categoria": "acessorios",
    "descricao": "Webcam Full HD para reunioes, aulas remotas e transmissao de video.",
    "preco": 459.9,
    "estoque": 19,
    "tags": [
      "webcam",
      "video",
      "full hd",
      "acessorio"
    ]
  },
  {
    "codigo": "PRD008",
    "nome": "Headset HyperX Cloud Stinger 2",
    "categoria": "audio",
    "descricao": "Headset com microfone ajustavel para comunicacao, estudo e jogos.",
    "preco": 319.9,
    "estoque": 31,
    "tags": [
      "headset",
      "audio",
      "microfone",
      "gamer"
    ]
  },
  {
    "codigo": "PRD009",
    "nome": "Roteador TP-Link Archer C6",
    "categoria": "redes",
    "descricao": "Roteador dual band para residencias e pequenos escritorios.",
    "preco": 289.9,
    "estoque": 26,
    "tags": [
      "roteador",
      "wifi",
      "dual band",
      "redes"
    ]
  },
  {
    "codigo": "PRD010",
    "nome": "Switch TP-Link 8 Portas",
    "categoria": "redes",
    "descricao": "Switch de mesa para expansao de rede cabeada em pequenos ambientes.",
    "preco": 129.9,
    "estoque": 38,
    "tags": [
      "switch",
      "rede",
      "ethernet",
      "8 portas"
    ]
  },
  {
    "codigo": "PRD011",
    "nome": "Cabo HDMI 2m",
    "categoria": "cabos",
    "descricao": "Cabo HDMI de dois metros para conexao de monitores, TVs e projetores.",
    "preco": 39.9,
    "estoque": 120,
    "tags": [
      "hdmi",
      "cabo",
      "video"
    ]
  },
  {
    "codigo": "PRD012",
    "nome": "Cabo de Rede Cat6 3m",
    "categoria": "cabos",
    "descricao": "Cabo de rede Cat6 para conexoes Gigabit Ethernet.",
    "preco": 29.9,
    "estoque": 95,
    "tags": [
      "cabo",
      "cat6",
      "ethernet",
      "rede"
    ]
  },
  {
    "codigo": "PRD013",
    "nome": "Pen Drive SanDisk 64GB",
    "categoria": "armazenamento",
    "descricao": "Pen drive USB para armazenamento e transporte de arquivos.",
    "preco": 54.9,
    "estoque": 74,
    "tags": [
      "pen drive",
      "usb",
      "64gb",
      "armazenamento"
    ],
    "capacidade": "64GB"
  },
  {
    "codigo": "PRD014",
    "nome": "Fonte Corsair CV550",
    "categoria": "componentes",
    "descricao": "Fonte de alimentacao de 550W para computadores de uso geral e intermediario.",
    "preco": 349.9,
    "estoque": 17,
    "tags": [
      "fonte",
      "550w",
      "componente"
    ],
    "potencia": "550W"
  },
  {
    "codigo": "PRD015",
    "nome": "Memoria Kingston Fury 16GB DDR4",
    "categoria": "componentes",
    "descricao": "Modulo de memoria RAM DDR4 de 16GB para desktops compativeis.",
    "preco": 279.9,
    "estoque": 44,
    "tags": [
      "memoria",
      "ram",
      "16gb",
      "ddr4"
    ],
    "memoria": "16GB"
  },
  {
    "codigo": "PRD016",
    "nome": "Hub USB 3.0 4 Portas",
    "categoria": "acessorios",
    "descricao": "Hub USB para expansao de portas em notebooks e computadores.",
    "preco": 89.9,
    "estoque": 52,
    "tags": [
      "hub",
      "usb",
      "acessorio"
    ]
  },
  {
    "codigo": "PRD017",
    "nome": "Suporte Articulado para Monitor",
    "categoria": "acessorios",
    "descricao": "Suporte de mesa articulado para monitores de uso residencial ou profissional.",
    "preco": 219.9,
    "estoque": 23,
    "tags": [
      "suporte",
      "monitor",
      "ergonomia",
      "acessorio"
    ]
  },
  {
    "codigo": "PRD018",
    "nome": "Nobreak Intelbras 1200VA",
    "categoria": "energia",
    "descricao": "Nobreak para protecao de computadores, roteadores e equipamentos de escritorio.",
    "preco": 699.9,
    "estoque": 14,
    "tags": [
      "nobreak",
      "energia",
      "protecao"
    ],
    "voltagem": "bivolt"
  },
  {
    "codigo": "PRD019",
    "nome": "Impressora Epson EcoTank L3250",
    "categoria": "impressao",
    "descricao": "Impressora multifuncional com tanque de tinta e conexao Wi-Fi.",
    "preco": 1299.9,
    "estoque": 11,
    "tags": [
      "impressora",
      "multifuncional",
      "wifi",
      "ecotank"
    ]
  },
  {
    "codigo": "PRD020",
    "nome": "Cadeira Escritorio Ergonomica",
    "categoria": "mobiliario",
    "descricao": "Cadeira com ajustes de altura e apoio lombar para estudo e trabalho.",
    "preco": 899.9,
    "estoque": 16,
    "tags": [
      "cadeira",
      "ergonomia",
      "escritorio"
    ],
    "cor": "preto"
  }
]
)

// ==============================
// COLEÇÃO: clientes
// ==============================
db.clientes.insertMany(
[
  {
    "codigo": "CLI001",
    "nome": "Ana Paula Ribeiro",
    "email": "ana.ribeiro@email.com",
    "cidade": "Registro",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI002",
    "nome": "Bruno Martins Costa",
    "email": "bruno.costa@email.com",
    "cidade": "Cajati",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI003",
    "nome": "Carla Mendes Souza",
    "email": "carla.mendes@email.com",
    "cidade": "Jacupiranga",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI004",
    "nome": "Diego Alves Rocha",
    "email": "diego.rocha@email.com",
    "cidade": "Pariquera-Acu",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI005",
    "nome": "Escola Novo Horizonte",
    "email": "compras@novohorizonte.edu.br",
    "cidade": "Registro",
    "uf": "SP",
    "segmento": "empresa"
  },
  {
    "codigo": "CLI006",
    "nome": "FarmaVale Drogaria",
    "email": "ti@farmavale.com.br",
    "cidade": "Cajati",
    "uf": "SP",
    "segmento": "empresa"
  },
  {
    "codigo": "CLI007",
    "nome": "Gabriel Fernandes Lima",
    "email": "gabriel.lima@email.com",
    "cidade": "Eldorado",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI008",
    "nome": "Helena Prado Nunes",
    "email": "helena.nunes@email.com",
    "cidade": "Sete Barras",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI009",
    "nome": "Inova Contabilidade Ltda",
    "email": "administrativo@inovacont.com.br",
    "cidade": "Registro",
    "uf": "SP",
    "segmento": "empresa"
  },
  {
    "codigo": "CLI010",
    "nome": "Joao Victor Moreira",
    "email": "joao.moreira@email.com",
    "cidade": "Cananeia",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI011",
    "nome": "Katia Oliveira Santos",
    "email": "katia.santos@email.com",
    "cidade": "Iguape",
    "uf": "SP",
    "segmento": "pessoa fisica"
  },
  {
    "codigo": "CLI012",
    "nome": "Litoral Sul Assistencia Tecnica",
    "email": "compras@litoralsultech.com.br",
    "cidade": "Registro",
    "uf": "SP",
    "segmento": "empresa"
  }
]
)

// ==============================
// COLEÇÃO: pedidos
// ==============================
db.pedidos.insertMany(
[
  {
    "codigo": "PED001",
    "cliente_id": "CLI001",
    "data": "2026-08-03",
    "forma_pagamento": "pix",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD002",
        "produto": "Mouse Logitech M170",
        "quantidade": 1,
        "preco": 79.9
      },
      {
        "produto_codigo": "PRD011",
        "produto": "Cabo HDMI 2m",
        "quantidade": 2,
        "preco": 39.9
      },
      {
        "produto_codigo": "PRD013",
        "produto": "Pen Drive SanDisk 64GB",
        "quantidade": 1,
        "preco": 54.9
      }
    ],
    "total": 214.6
  },
  {
    "codigo": "PED002",
    "cliente_id": "CLI005",
    "data": "2026-08-04",
    "forma_pagamento": "boleto",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD004",
        "produto": "Monitor LG 24MP400",
        "quantidade": 3,
        "preco": 749.9
      },
      {
        "produto_codigo": "PRD002",
        "produto": "Mouse Logitech M170",
        "quantidade": 8,
        "preco": 79.9
      },
      {
        "produto_codigo": "PRD003",
        "produto": "Teclado Redragon Kumara",
        "quantidade": 4,
        "preco": 249.9
      },
      {
        "produto_codigo": "PRD012",
        "produto": "Cabo de Rede Cat6 3m",
        "quantidade": 10,
        "preco": 29.9
      }
    ],
    "total": 4187.5
  },
  {
    "codigo": "PED003",
    "cliente_id": "CLI003",
    "data": "2026-08-05",
    "forma_pagamento": "cartao credito",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD008",
        "produto": "Headset HyperX Cloud Stinger 2",
        "quantidade": 1,
        "preco": 319.9
      },
      {
        "produto_codigo": "PRD016",
        "produto": "Hub USB 3.0 4 Portas",
        "quantidade": 1,
        "preco": 89.9
      }
    ],
    "total": 409.8
  },
  {
    "codigo": "PED004",
    "cliente_id": "CLI006",
    "data": "2026-08-07",
    "forma_pagamento": "pix",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD009",
        "produto": "Roteador TP-Link Archer C6",
        "quantidade": 2,
        "preco": 289.9
      },
      {
        "produto_codigo": "PRD010",
        "produto": "Switch TP-Link 8 Portas",
        "quantidade": 3,
        "preco": 129.9
      },
      {
        "produto_codigo": "PRD012",
        "produto": "Cabo de Rede Cat6 3m",
        "quantidade": 8,
        "preco": 29.9
      }
    ],
    "total": 1208.7
  },
  {
    "codigo": "PED005",
    "cliente_id": "CLI002",
    "data": "2026-08-09",
    "forma_pagamento": "cartao credito",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD001",
        "produto": "Notebook Lenovo IdeaPad 3",
        "quantidade": 1,
        "preco": 3299.9
      },
      {
        "produto_codigo": "PRD002",
        "produto": "Mouse Logitech M170",
        "quantidade": 1,
        "preco": 79.9
      },
      {
        "produto_codigo": "PRD016",
        "produto": "Hub USB 3.0 4 Portas",
        "quantidade": 1,
        "preco": 89.9
      }
    ],
    "total": 3469.7
  },
  {
    "codigo": "PED006",
    "cliente_id": "CLI009",
    "data": "2026-08-11",
    "forma_pagamento": "boleto",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD004",
        "produto": "Monitor LG 24MP400",
        "quantidade": 5,
        "preco": 749.9
      },
      {
        "produto_codigo": "PRD017",
        "produto": "Suporte Articulado para Monitor",
        "quantidade": 5,
        "preco": 219.9
      },
      {
        "produto_codigo": "PRD011",
        "produto": "Cabo HDMI 2m",
        "quantidade": 10,
        "preco": 39.9
      }
    ],
    "total": 5248.0
  },
  {
    "codigo": "PED007",
    "cliente_id": "CLI007",
    "data": "2026-08-13",
    "forma_pagamento": "pix",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD003",
        "produto": "Teclado Redragon Kumara",
        "quantidade": 1,
        "preco": 249.9
      },
      {
        "produto_codigo": "PRD002",
        "produto": "Mouse Logitech M170",
        "quantidade": 1,
        "preco": 79.9
      },
      {
        "produto_codigo": "PRD011",
        "produto": "Cabo HDMI 2m",
        "quantidade": 1,
        "preco": 39.9
      }
    ],
    "total": 369.7
  },
  {
    "codigo": "PED008",
    "cliente_id": "CLI012",
    "data": "2026-08-15",
    "forma_pagamento": "boleto",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD005",
        "produto": "SSD Kingston NV2 1TB",
        "quantidade": 4,
        "preco": 429.9
      },
      {
        "produto_codigo": "PRD015",
        "produto": "Memoria Kingston Fury 16GB DDR4",
        "quantidade": 6,
        "preco": 279.9
      },
      {
        "produto_codigo": "PRD014",
        "produto": "Fonte Corsair CV550",
        "quantidade": 2,
        "preco": 349.9
      }
    ],
    "total": 4098.8
  },
  {
    "codigo": "PED009",
    "cliente_id": "CLI004",
    "data": "2026-08-18",
    "forma_pagamento": "cartao debito",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD013",
        "produto": "Pen Drive SanDisk 64GB",
        "quantidade": 2,
        "preco": 54.9
      },
      {
        "produto_codigo": "PRD012",
        "produto": "Cabo de Rede Cat6 3m",
        "quantidade": 2,
        "preco": 29.9
      },
      {
        "produto_codigo": "PRD011",
        "produto": "Cabo HDMI 2m",
        "quantidade": 2,
        "preco": 39.9
      }
    ],
    "total": 249.4
  },
  {
    "codigo": "PED010",
    "cliente_id": "CLI010",
    "data": "2026-08-21",
    "forma_pagamento": "pix",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD007",
        "produto": "Webcam Logitech C920",
        "quantidade": 1,
        "preco": 459.9
      },
      {
        "produto_codigo": "PRD008",
        "produto": "Headset HyperX Cloud Stinger 2",
        "quantidade": 1,
        "preco": 319.9
      }
    ],
    "total": 779.8
  },
  {
    "codigo": "PED011",
    "cliente_id": "CLI011",
    "data": "2026-08-24",
    "forma_pagamento": "cartao credito",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD019",
        "produto": "Impressora Epson EcoTank L3250",
        "quantidade": 1,
        "preco": 1299.9
      },
      {
        "produto_codigo": "PRD011",
        "produto": "Cabo HDMI 2m",
        "quantidade": 1,
        "preco": 39.9
      }
    ],
    "total": 1339.8
  },
  {
    "codigo": "PED012",
    "cliente_id": "CLI005",
    "data": "2026-08-28",
    "forma_pagamento": "boleto",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD018",
        "produto": "Nobreak Intelbras 1200VA",
        "quantidade": 2,
        "preco": 699.9
      },
      {
        "produto_codigo": "PRD009",
        "produto": "Roteador TP-Link Archer C6",
        "quantidade": 2,
        "preco": 289.9
      },
      {
        "produto_codigo": "PRD010",
        "produto": "Switch TP-Link 8 Portas",
        "quantidade": 4,
        "preco": 129.9
      }
    ],
    "total": 2499.2
  },
  {
    "codigo": "PED013",
    "cliente_id": "CLI001",
    "data": "2026-09-01",
    "forma_pagamento": "pix",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD017",
        "produto": "Suporte Articulado para Monitor",
        "quantidade": 1,
        "preco": 219.9
      },
      {
        "produto_codigo": "PRD016",
        "produto": "Hub USB 3.0 4 Portas",
        "quantidade": 2,
        "preco": 89.9
      }
    ],
    "total": 399.7
  },
  {
    "codigo": "PED014",
    "cliente_id": "CLI009",
    "data": "2026-09-03",
    "forma_pagamento": "boleto",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD001",
        "produto": "Notebook Lenovo IdeaPad 3",
        "quantidade": 2,
        "preco": 3299.9
      },
      {
        "produto_codigo": "PRD004",
        "produto": "Monitor LG 24MP400",
        "quantidade": 2,
        "preco": 749.9
      },
      {
        "produto_codigo": "PRD002",
        "produto": "Mouse Logitech M170",
        "quantidade": 4,
        "preco": 79.9
      }
    ],
    "total": 8419.2
  },
  {
    "codigo": "PED015",
    "cliente_id": "CLI008",
    "data": "2026-09-05",
    "forma_pagamento": "cartao credito",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD020",
        "produto": "Cadeira Escritorio Ergonomica",
        "quantidade": 1,
        "preco": 899.9
      },
      {
        "produto_codigo": "PRD011",
        "produto": "Cabo HDMI 2m",
        "quantidade": 2,
        "preco": 39.9
      }
    ],
    "total": 979.7
  },
  {
    "codigo": "PED016",
    "cliente_id": "CLI006",
    "data": "2026-09-07",
    "forma_pagamento": "pix",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD015",
        "produto": "Memoria Kingston Fury 16GB DDR4",
        "quantidade": 4,
        "preco": 279.9
      },
      {
        "produto_codigo": "PRD005",
        "produto": "SSD Kingston NV2 1TB",
        "quantidade": 2,
        "preco": 429.9
      },
      {
        "produto_codigo": "PRD012",
        "produto": "Cabo de Rede Cat6 3m",
        "quantidade": 6,
        "preco": 29.9
      }
    ],
    "total": 2158.8
  },
  {
    "codigo": "PED017",
    "cliente_id": "CLI003",
    "data": "2026-09-09",
    "forma_pagamento": "cartao debito",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD002",
        "produto": "Mouse Logitech M170",
        "quantidade": 2,
        "preco": 79.9
      },
      {
        "produto_codigo": "PRD013",
        "produto": "Pen Drive SanDisk 64GB",
        "quantidade": 2,
        "preco": 54.9
      }
    ],
    "total": 269.6
  },
  {
    "codigo": "PED018",
    "cliente_id": "CLI012",
    "data": "2026-09-11",
    "forma_pagamento": "boleto",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD014",
        "produto": "Fonte Corsair CV550",
        "quantidade": 3,
        "preco": 349.9
      },
      {
        "produto_codigo": "PRD015",
        "produto": "Memoria Kingston Fury 16GB DDR4",
        "quantidade": 5,
        "preco": 279.9
      },
      {
        "produto_codigo": "PRD010",
        "produto": "Switch TP-Link 8 Portas",
        "quantidade": 4,
        "preco": 129.9
      }
    ],
    "total": 2968.8
  },
  {
    "codigo": "PED019",
    "cliente_id": "CLI002",
    "data": "2026-09-14",
    "forma_pagamento": "pix",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD009",
        "produto": "Roteador TP-Link Archer C6",
        "quantidade": 1,
        "preco": 289.9
      },
      {
        "produto_codigo": "PRD012",
        "produto": "Cabo de Rede Cat6 3m",
        "quantidade": 3,
        "preco": 29.9
      }
    ],
    "total": 379.6
  },
  {
    "codigo": "PED020",
    "cliente_id": "CLI005",
    "data": "2026-09-16",
    "forma_pagamento": "boleto",
    "status": "concluido",
    "itens": [
      {
        "produto_codigo": "PRD002",
        "produto": "Mouse Logitech M170",
        "quantidade": 10,
        "preco": 79.9
      },
      {
        "produto_codigo": "PRD003",
        "produto": "Teclado Redragon Kumara",
        "quantidade": 6,
        "preco": 249.9
      },
      {
        "produto_codigo": "PRD016",
        "produto": "Hub USB 3.0 4 Portas",
        "quantidade": 8,
        "preco": 89.9
      },
      {
        "produto_codigo": "PRD011",
        "produto": "Cabo HDMI 2m",
        "quantidade": 12,
        "preco": 39.9
      }
    ],
    "total": 3496.4
  }
]
)

// Conferências simples de carga
db.produtos.countDocuments()
db.clientes.countDocuments()
db.pedidos.countDocuments()
