package utils

import "math/rand"

func GenerateRandomPassword(length int) string {

	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	newPassword := make([]byte, length)

	for i := range newPassword {
		newPassword[i] = charset[rand.Intn(len(charset))]
	}

	return "@" + string(newPassword) + "5"

}
