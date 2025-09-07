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
