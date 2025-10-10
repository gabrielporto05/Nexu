
INSERT INTO users(name, nick, email, password) VALUES
("Chines Porto", "chines05", "chines@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Gabriel Martins", "gabriel", "gabriel@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Julia Araujo", "julia", "julia@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Joao Gabriel", "joao", "joao@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Pedro Viana", "pedro", "pedro@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK");

INSERT INTO followers(user_id, follower_id) VALUES
(1, 2),
(1, 3),
(3, 1),
(2, 1),
(3, 4),
(4, 2),
(4, 1);

INSERT INTO posts(title, description, author_id, likes) VALUES
("📢 Oportunidade de Estágio em Desenvolvimento na Fleye! ", "📢 Oportunidade de Estágio em Desenvolvimento na Fleye! 
 Remunerado | 100% remoto

Nesta posição você fará parte do nosso time de Tecnologia colaborando na projeção, desenvolvimento e implementação de soluções digitais para clientes nacionais e internacionais. Trabalhando lado a lado com as equipes de Design e Produto, o time de Tecnologia participa de todas as etapas do processo: desde a compreensão das dores dos clientes até a entrega do produto final. Na Fleye, oferecemos um ambiente acolhedor, dinâmico e repleto de oportunidades para quem está iniciando na área.

💡RESPONSABILIDADES E ATRIBUIÇÕES:
- Apoiar no desenvolvimento de novas funcionalidades e na manutenção de produtos digitais;
- Participar da avaliação de testes de software;
- Ser um verdadeiro Fleyer: engajar-se nas iniciativas da empresa e vestir a camisa do time.

🎓 REQUISITOS E QUALIFICAÇÕES:
Estar cursando ensino superior em Ciência da Computação, Engenharia da Computação, Análise e Desenvolvimento de Sistemas ou áreas correlatas de Tecnologia da Informação.
 
🧡 COMO FLEYER VOCÊ TERÁ:
- Modelo de contratação: estágio remunerado;
- Anywhere-office: trabalhe de onde quiser, sempre com a possibilidade de visitar e trabalhar em nossa sede presencial em Porto Alegre (RS);
- Flexibilidade de horário: trabalhe de acordo com os seus horários com autonomia e responsabilidade, respeitando os encontros combinados com o time;
- Férias: 15 dias a cada 6 meses trabalhados, para curtir como quiser;
= Ambiente colaborativo: faça parte de um time descontraído, engajado em se desenvolver e envolvido em muita troca de conhecimentos.

➡️ Para se candidatar acesse este link: https://lnkd.in/d87Azp3p", 1, 4),
("Post 2", "Post 2 description", 1, 2),
("Post 3", "Post 3 description", 1, 3),
("Post 4", "Post 4 description", 2, 0),
("Post 5", "Post 5 description", 2, 5),
("Post 6", "Post 6 description", 2, 1),
("Post 7", "Post 7 description", 4, 7),
("Post 8", "Post 8 description", 4, 3),
("Post 9", "Post 9 description", 5, 10),
("Post 10", "Post 10 description", 3, 3);
