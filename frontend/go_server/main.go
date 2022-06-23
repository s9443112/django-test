package main

import (
	"github/doghow/server/router"

	"github.com/gin-gonic/gin"

)

func main() {
	

	serv := gin.Default()
	
	router.InitRouter(router.RouterConfig{
		Router: serv.Group("/"),
	
	})

	serv.Run("0.0.0.0:4000")
}
