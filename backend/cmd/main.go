package main

import (
	"industrix-backend/config"
	"industrix-backend/routes"
	"log"

	"github.com/joho/godotenv"
)

func main() {

	_ = godotenv.Load()
	// 1. Connect to Database
	config.ConnectDB()

	// 2. Setup Router
	r := routes.SetupRouter()

	// 3. Run Server
	log.Println("Server starting on port 8080...")
	r.Run(":8080")
}
