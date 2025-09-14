# 📘 Nexu - Mini Rede Social em Go

**Nexu** é uma aplicação backend desenvolvida em Go que simula uma rede social minimalista e escalável. Usuários podem se registrar, seguir uns aos outros, publicar conteúdos, curtir e descurtir publicações, além de atualizar seus dados com segurança. A arquitetura foi pensada para evoluir facilmente para um app mobile completo.

---

## 🚀 Funcionalidades

- ✅ **Autenticação Completa**: Cadastro e login com autenticação JWT
- ✅ **Gestão de Perfil**: Atualização de perfil e senha com validação segura
- ✅ **Descoberta de Usuários**: Listagem e busca de usuários por nome ou apelido
- ✅ **Sistema de Seguidores**: Seguir e deixar de seguir outros usuários
- ✅ **Social Network**: Listar seguidores e quem o usuário está seguindo
- ✅ **Publicações**: Criar, buscar, atualizar e deletar posts
- ✅ **Interações**: Curtir e descurtir publicações
- ✅ **Feed Personalizado**: Listar posts do usuário logado e de quem ele segue
- 🔒 **Segurança**: Proteção de rotas com middleware de autenticação
- 📦 **Arquitetura Escalável**: Estrutura modular e pronta para crescer

---

## 📦 Estrutura do Projeto

```bash
api/
├── main.go
├── go.mod / go.sum
├── sql/               # Scripts de criação e seed do banco
├── src/
│   ├── auth/          # Lógica de autenticação JWT
│   ├── config/        # Variáveis de ambiente
│   ├── controllers/   # Lógica das rotas
│   ├── db/            # Conexão com MySQL
│   ├── middlewares/   # Autenticação e logging
│   ├── models/        # Estrutura e validação dos dados
│   ├── repositories/  # Acesso ao banco de dados
│   ├── responses/     # Formatação de respostas JSON
│   ├── router/        # Configuração das rotas
│   └── secret/        # Hash e verificação de senhas
```

---

## 🛠️ Tecnologias Utilizadas

- **Go (Golang)** — linguagem principal para alta performance
- **MySQL** — banco de dados relacional
- **JWT** — autenticação segura e stateless
- **bcrypt** — hash de senhas com salt
- **Gorilla Mux** — roteador HTTP robusto
- **dotenv** — gerenciamento seguro de variáveis de ambiente

---

## 📄 API Endpoints

### 🔐 Autenticação
- `POST /api/auth/login` — Login do usuário
- `POST /api/auth/register` — Registro de novo usuário

### 👤 Usuários
- `POST /api/users` — Criar usuário
- `GET /api/users?nameOrNick=` — Buscar usuários por nome ou apelido
- `GET /api/users/{userId}` — Buscar usuário por ID
- `PUT /api/users/{userId}` — Atualizar perfil
- `PATCH /api/users/{userId}/update-password` — Atualizar senha
- `DELETE /api/users/{userId}` — Deletar conta

### 👥 Seguidores
- `POST /api/users/{userId}/follow` — Seguir usuário
- `DELETE /api/users/{userId}/unfollow` — Deixar de seguir
- `GET /api/users/{userId}/followers` — Listar seguidores
- `GET /api/users/{userId}/following` — Listar quem o usuário segue

### 📝 Publicações
- `POST /api/posts` — Criar publicação
- `GET /api/posts` — Listar publicações do usuário logado e de quem ele segue
- `GET /api/posts/{postId}` — Buscar publicação por ID
- `GET /api/users/{userId}/posts` — Listar publicações de um usuário específico
- `PUT /api/posts/{postId}` — Atualizar publicação
- `DELETE /api/posts/{postId}` — Deletar publicação
- `PATCH /api/posts/{postId}/like` — Curtir publicação
- `PATCH /api/posts/{postId}/unlike` — Descurtir publicação

---

## ⚙️ Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/chines05/nexu.git
   cd nexu/api
   ```

2. **Configure o arquivo `.env`:**
   ```env
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nexu
   DB_HOST=localhost
   DB_PORT=3306
   SECRET_KEY=sua_chave_secreta
   API_PORT=5000
   ```

3. **Instale as dependências:**
   ```bash
   go mod tidy
   ```

4. **Execute o projeto:**
   ```bash
   go run main.go
   ```

5. **Acesse a API:**
   ```
   http://localhost:8080
   ```
