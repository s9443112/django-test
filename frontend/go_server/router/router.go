package router

import (
	"github.com/gin-gonic/gin"
)

type RouterConfig struct {
	Router *gin.RouterGroup
}

func InitRouter(config RouterConfig) {
	router := config.Router

	router.GET("/", func(c *gin.Context) {
		c.Redirect(302, "/admin")
	})

	

	websiteRouter(WebsiteRouteConfig{
		route:    router.Group("/admin"),
		servPath: "./website",
	})
}
