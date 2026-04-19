package middleware

import (
	"fmt"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/skylinebear/new-api/common"
)

func RelayPanicRecover() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				common.SysLog(fmt.Sprintf("panic detected: %v", err))
				common.SysLog(fmt.Sprintf("stacktrace from panic: %s", string(debug.Stack())))
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": gin.H{
						"message": fmt.Sprintf("Panic detected, error: %v. Please review the server logs or open an issue in your current repository.", err),
						"type":    "eastcrea_panic",
					},
				})
				c.Abort()
			}
		}()
		c.Next()
	}
}
