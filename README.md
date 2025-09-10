# 📘 DevBook - Mini Rede Social em Go

DevBook é uma aplicação backend desenvolvida em Go que simula uma rede social minimalista. Usuários podem se registrar, seguir uns aos outros, atualizar seus dados, e futuramente poderão publicar conteúdos e interagir com publicações de outros usuários.

---

## 🚀 Funcionalidades

- ✅ Cadastro e login de usuários com autenticação JWT
- ✅ Atualização de perfil e senha com validação segura
- ✅ Listagem de usuários por nome ou apelido
- ✅ Seguir e deixar de seguir outros usuários
- ✅ Listar seguidores e quem o usuário está seguindo
- 🔒 Proteção de rotas com middleware de autenticação
- 🔜 (Em breve) Publicações, curtidas e comentários

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

- **Go (Golang)** — linguagem principal
- **MySQL** — banco de dados relacional
- **JWT** — autenticação segura
- **bcrypt** — hash de senhas
- **Gorilla Mux** — roteador HTTP
- **dotenv** — gerenciamento de variáveis de ambiente

---

## 📄 Rotas Principais

### 🔐 Autenticação

- `POST /api/auth/login` — Login do usuário
- `POST /api/auth/register` — Registro (em construção)

### 👤 Usuários

- `POST /api/users` — Criar usuário
- `GET /api/users?nameOrNick=` — Buscar usuários
- `GET /api/users/{userId}` — Buscar por ID
- `PUT /api/users/{userId}` — Atualizar perfil
- `PATCH /api/users/{userId}/update-password` — Atualizar senha
- `DELETE /api/users/{userId}` — Deletar conta

### 👥 Seguidores

- `POST /api/users/{userId}/follow` — Seguir usuário
- `DELETE /api/users/{userId}/unfollow` — Deixar de seguir
- `GET /api/users/{userId}/followers` — Listar seguidores
- `GET /api/users/{userId}/following` — Listar quem o usuário segue

---

## ⚙️ Como Rodar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/devbook.git
   cd devbook/api
   ```

2. **Configure o .env:**

   ```env
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=devbook
   DB_HOST=localhost
   DB_PORT=3306
   JWT_SECRET=sua_chave_secreta
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

---

## 📌 Próximos Passos

- [ ] Implementar sistema de publicações
- [ ] Curtidas e comentários
- [ ] Feed personalizado
- [ ] Upload de imagens
- [ ] Testes automatizados

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
