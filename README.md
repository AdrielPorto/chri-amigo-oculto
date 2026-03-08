# C-H-R-I na veia - Amigo Oculto

Uma aplicação moderna e responsiva para gerenciar sorteios de amigo oculto, construída com React, Vite, Tailwind CSS e Supabase.

## 🚀 Tecnologias

- **Frontend:** React (Hooks), TypeScript, Tailwind CSS, Lucide React (Ícones)
- **Build Tool:** Vite
- **Backend/Database:** Supabase (PostgreSQL, Auth, Realtime)
- **Deploy Automático:** GitHub Actions + GitHub Pages

## 📦 Estrutura do Projeto

O código-fonte da aplicação está organizado dentro da pasta `src/`:

- `src/components/`: Componentes React reutilizáveis (Layout, Paineis de Admin, Portal de Participantes).
- `src/utils/`: Funções utilitárias e integração com a API do Supabase (`supabaseApi.ts`, `supabaseClient.ts`).
- `src/App.tsx`: Ponto de entrada principal da aplicação, contendo as rotas e o estado global.
- `src/types.ts`: Definições de tipos do TypeScript usadas em toda a aplicação.

## ⚙️ Como Executar Localmente

**Pré-requisitos:** Node.js (versão 18 ou superior).

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/chri-amigo-oculto.git
cd chri-amigo-oculto
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase:
   - Certifique-se de que as tabelas necessárias foram criadas no seu projeto Supabase, você pode usar o script SQL localizado em `supabase.sql` na raiz do projeto.
   - Verifique as credenciais no arquivo `src/utils/supabaseClient.ts`.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação no seu navegador: `http://localhost:3000`

## 📄 Scripts Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento usando Vite.
- `npm run build`: Cria uma versão otimizada da aplicação para produção.
- `npm run preview`: Permite visualizar localmente o *build* gerado para produção.
