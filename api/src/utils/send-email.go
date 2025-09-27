package utils

import (
	"api/src/config"
	"fmt"
	"net/smtp"
)

func SendEmail(to, subject, novaSenha string) error {
	from := config.MyEmail
	password := config.MyEmailPassowrd

	body := fmt.Sprintf(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Recuperação de Senha</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Recuperação de Senha - Nexu</h2>
            <p>Sua nova senha foi gerada com sucesso:</p>
            <p style="font-size: 18px; font-weight: bold; color: #855CF8;">%s</p>
            <p>Você pode usá-la para acessar sua conta normalmente.</p>
            <p>Por segurança, recomendamos que você altere essa senha nas configurações do seu perfil assim que possível.</p>
            <br>
            <p>Atenciosamente,<br><strong>Equipe Nexu</strong></p>
        </body>
        </html>
    `, novaSenha)

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n" +
		"MIME-Version: 1.0\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\n\n" +
		body

	return smtp.SendMail(
		"smtp.gmail.com:587",
		smtp.PlainAuth("", from, password, "smtp.gmail.com"),
		from,
		[]string{to},
		[]byte(msg),
	)
}
