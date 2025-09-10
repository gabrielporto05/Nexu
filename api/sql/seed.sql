INSERT INTO users(name, nick, email, password) VALUES
("Chines Porto", "chines05", "chines@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Gabriel Martins", "gabriel", "gabriel@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Julia Araujo", "julia", "julia@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Joao Gabriel", "joao", "joao@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK"),
("Pedro Viana", "pedro", "pedro@email.com", "$2a$10$G9CVffPs9x2MSd66TYNWoeOJOSQN9zlPg/76mIM5V1T/K10FQ1OxK");

INSERT INTO followers(user_id, follower_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 4),
(4, 2),
(4, 1);

INSERT INTO posts(title, description, author_id, likes) VALUES
("Post 1", "Post 1 description", 1, 4),
("Post 2", "Post 2 description", 1, 2),
("Post 3", "Post 3 description", 1, 3),
("Post 4", "Post 4 description", 2, 0),
("Post 5", "Post 5 description", 2, 5),
("Post 6", "Post 6 description", 2, 1),
("Post 7", "Post 7 description", 4, 7),
("Post 8", "Post 8 description", 4, 3),
("Post 9", "Post 9 description", 5, 10),
("Post 10", "Post 10 description", 3, 3);
