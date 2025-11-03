package utils

import (
	"strings"
)

func IsDuplicateError(err error) (bool, string) {
	if err == nil {
		return false, ""
	}

	errStr := err.Error()

	if strings.Contains(errStr, "Error 1062") {
		if strings.Contains(errStr, "users.nick") {
			return true, "nick"
		}
		if strings.Contains(errStr, "users.email") {
			return true, "email"
		}
		return true, "unknown"
	}

	return false, ""
}
