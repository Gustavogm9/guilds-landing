# Guilds Landing

Este repositório contém a aplicação de Front-end institucional (Landing Pages e Sub-páginas) da **Guilds**. 

## Stack Tecnológica

O projeto foi construído sobre uma arquitetura robusta de React e foca em máxima performance e indexação (SEO):

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui & Radix UI

## Como Desenvolver

```bash
# Instale as dependências
npm install

# Inicie o servidor local na porta 8080
npm run dev
```

## Estrutura de Diretórios
- `src/components/`: Componentes modulares
- `src/pages/`: Rotas publicamente indexáveis da Guilds
- `src/lib/`: Coleção abrangente utilitários de sistema (SEO, A11y, Performance)

## Implantação (Deployment)

O projeto está otimizado para deploy em plataformas como Vercel ou Netlify, fazendo uso das configurações avançadas do Vite (minificação, chunking). Execute `npm run build` para gerar a versão estática e otimizada do bundle em `/dist`.
