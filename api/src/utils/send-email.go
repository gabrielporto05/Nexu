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
		<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
		<div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
			<div style="text-align: center; margin-bottom: 30px;">
			<img src="https://res.cloudinary.com/dmkgy2lyl/image/upload/v1759018808/NexuApenasSemFundoPreta_mzct16.png" alt="Logo Nexu" />
			</div>

			<h2 style="text-align: center; color: #855CF8;">Recuperação de Senha</h2>
			<p style="font-size: 16px; text-align: center;">Sua nova senha foi gerada com sucesso:</p>

			<div style="background-color: #f1f1f1; padding: 20px; text-align: center; border-radius: 6px; margin: 20px 0;">
			<span style="font-size: 20px; font-weight: bold; color: #333;">%s</span>
			</div>

			<p style="font-size: 15px; line-height: 1.6;">
			Você pode usá-la para acessar sua conta normalmente.
			<br><br>
			<strong style="color: #d9534f;">⚠️ Por segurança, recomendamos que você altere essa senha nas configurações do seu perfil assim que possível.</strong>
			</p>

			<p style="margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
			Atenciosamente,<br><strong>Equipe Nexu</strong>
			</p>
		</div>
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
