package controllers

import (
	"industrix-backend/config"
	"industrix-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetCategories(c *gin.Context) {
	var categories []models.Category
	config.DB.Find(&categories)
	c.JSON(http.StatusOK, categories)
}

func CreateCategory(c *gin.Context) {
	var input models.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CreatedAt = time.Now()
	config.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	config.DB.Delete(&models.Category{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}
