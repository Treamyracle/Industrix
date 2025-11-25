package controllers

import (
	"industrix-backend/config"
	"industrix-backend/models"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func GetTodos(c *gin.Context) {
	var todos []models.Todo
	var total int64

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	search := c.Query("search")
	sortBy := c.DefaultQuery("sort_by", "created_at")
	order := c.DefaultQuery("order", "desc")

	priority := c.Query("priority")
	completed := c.Query("completed")
	categoryID := c.Query("category_id")

	query := config.DB.Model(&models.Todo{}).Preload("Category")
	query = query.Joins("LEFT JOIN categories ON categories.id = todos.category_id")

	if search != "" {
		query = query.Where("todos.title ILIKE ?", "%"+search+"%")
	}

	if priority != "" {
		query = query.Where("todos.priority = ?", priority)
	}
	if completed != "" {
		isCompleted := completed == "true"
		query = query.Where("todos.completed = ?", isCompleted)
	}
	if categoryID != "" {
		query = query.Where("todos.category_id = ?", categoryID)
	}

	switch sortBy {
	case "priority":
		if order == "asc" {
			query = query.Order("CASE WHEN priority='low' THEN 1 WHEN priority='medium' THEN 2 WHEN priority='high' THEN 3 ELSE 4 END")
		} else {
			query = query.Order("CASE WHEN priority='high' THEN 1 WHEN priority='medium' THEN 2 WHEN priority='low' THEN 3 ELSE 4 END")
		}
	case "category":
		query = query.Order("categories.name " + order)
	case "status":
		query = query.Order("completed " + order)
	default:
		query = query.Order("todos." + sortBy + " " + order)
	}

	query.Count(&total)
	result := query.Select("todos.*").Limit(limit).Offset(offset).Find(&todos)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.TodoResponse{
		Data: todos,
		Pagination: models.PaginationMeta{
			CurrentPage: page,
			PerPage:     limit,
			Total:       total,
			TotalPages:  totalPages,
		},
	}

	c.JSON(http.StatusOK, response)
}

func CreateTodo(c *gin.Context) {
	var input models.Todo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	config.DB.Preload("Category").First(&input, input.ID)
	c.JSON(http.StatusCreated, input)
}

func ToggleTodoComplete(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo

	if err := config.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	newStatus := !todo.Completed
	config.DB.Model(&todo).Updates(map[string]interface{}{
		"completed":  newStatus,
		"updated_at": time.Now(),
	})

	c.JSON(http.StatusOK, gin.H{"message": "Status updated", "completed": newStatus})
}

func DeleteTodo(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Todo{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete todo"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
}

func UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo
	if err := config.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	var input models.Todo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo.Title = input.Title
	todo.Description = input.Description
	todo.Priority = input.Priority
	todo.CategoryID = input.CategoryID
	todo.DueDate = input.DueDate
	todo.UpdatedAt = time.Now()

	config.DB.Save(&todo)
	c.JSON(http.StatusOK, todo)
}
