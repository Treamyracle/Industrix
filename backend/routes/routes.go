package routes

import (
	"industrix-backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS Configuration (Required for React Frontend)
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type"}
	r.Use(cors.New(config))

	api := r.Group("/api")
	{
		// Todos
		api.GET("/todos", controllers.GetTodos)
		api.POST("/todos", controllers.CreateTodo)
		api.PUT("/todos/:id", controllers.UpdateTodo)
		api.DELETE("/todos/:id", controllers.DeleteTodo)
		api.PATCH("/todos/:id/complete", controllers.ToggleTodoComplete)

		// Categories
		api.GET("/categories", controllers.GetCategories)
		api.POST("/categories", controllers.CreateCategory)
		api.DELETE("/categories/:id", controllers.DeleteCategory)
	}

	return r
}
