package config

import (
	"fmt"
	"industrix-backend/models"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	DB.AutoMigrate(&models.Category{}, &models.Todo{})

	seedCategories()
}

func seedCategories() {

	defaultCategories := []models.Category{
		{Name: "Work", Color: "#1677ff"},
		{Name: "Personal", Color: "#52c41a"},
		{Name: "Shopping", Color: "#faad14"},
	}

	for _, cat := range defaultCategories {
		var count int64

		DB.Model(&models.Category{}).Where("name = ?", cat.Name).Count(&count)

		if count == 0 {

			cat.CreatedAt = time.Now()
			if err := DB.Create(&cat).Error; err != nil {
				log.Printf("Failed to seed category %s: %v", cat.Name, err)
			} else {
				log.Printf("Seeded default category: %s", cat.Name)
			}
		}
	}
}
