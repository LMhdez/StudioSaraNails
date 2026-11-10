# Studio Sara Nails

Aplicação web para apresentação e gestão de serviços de um estúdio de unhas, com agenda e área administrativa.

## Funcionalidades identificadas na estrutura

- Páginas públicas de início, contacto e serviços.
- Agenda e marcação de serviços.
- Autenticação, recuperação e reposição de palavra-passe.
- Área de administração e operações sobre serviços.
- Interface multilingue.
- Integração com Supabase, EmailJS e calendário Schedule-X.

## Tecnologia

- React 19
- Vite 7
- React Router 7
- Supabase JavaScript client
- React Hook Form e Yup
- TanStack Query
- Schedule-X
- i18next / react-i18next
- Tailwind CSS 4

## Requisitos

- Node.js compatível com a versão de Vite declarada no `package.json`.
- npm.

## Instalação e execução

A partir desta pasta:

```bash
npm install
npm run dev
```

## Validação e build

```bash
npm run lint
npm run build
npm run preview
```

## Configuração e segurança

Revê `src/supabaseClient.js` e as integrações de EmailJS para identificar os nomes das configurações necessárias. Não coloques service-role keys, tokens privados, palavras-passe ou segredos no frontend. As chaves anon/public do Supabase só podem ser usadas com Row Level Security e políticas adequadas; a segurança não pode depender de esconder valores no JavaScript.

Não publiques ficheiros `.env` nem credenciais de produção. Usa variáveis de ambiente locais e configura os valores de build no fornecedor de alojamento.