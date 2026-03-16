# DistribuidorFull

Projeto unificado com front-end (Vue 3) e back-end (Node.js/Express).

## Estrutura

```
distribuidorfull/
├── frontend/   # Vue 3 + Vite + Vuetify
└── backend/    # Node.js + Express + MySQL/Sequelize
```

## Instalação

```bash
npm run install:all
```

## Desenvolvimento

Rodar front e back simultaneamente:

```bash
npm run dev
```

Ou separadamente:

```bash
npm run dev:front   # http://localhost:5173
npm run dev:back    # http://localhost:3000 (ou porta configurada)
```

## Build

```bash
npm run build
```

## Testes (back-end)

```bash
npm run test:back
```

## Configuração

Crie um arquivo `.env` dentro de `backend/` com as variáveis necessárias (veja `backend/README.md`).
