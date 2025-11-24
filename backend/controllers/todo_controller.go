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

// GET /api/todos
func GetTodos(c *gin.Context) {
	var todos []models.Todo
	var total int64

	// 1. Pagination Params
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	// 2. Filter Params
	search := c.Query("search")

	query := config.DB.Model(&models.Todo{}).Preload("Category")

	// 3. Search Logic
	if search != "" {
		query = query.Where("title ILIKE ?", "%"+search+"%")
	}

	// 4. Execute Count
	query.Count(&total)

	// 5. Execute Query with Pagination
	result := query.Limit(limit).Offset(offset).Order("created_at DESC").Find(&todos)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// 6. Calculate Total Pages
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	// 7. Format Response matches requirements
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

// POST /api/todos
func CreateTodo(c *gin.Context) {
	var input models.Todo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // Proper validation error
		return
	}

	// Set defaults
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Re-fetch to include category data
	config.DB.Preload("Category").First(&input, input.ID)
	c.JSON(http.StatusCreated, input)
}

// PATCH /api/todos/:id/complete
func ToggleTodoComplete(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo

	if err := config.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	// Toggle status
	newStatus := !todo.Completed
	config.DB.Model(&todo).Updates(map[string]interface{}{
		"completed":  newStatus,
		"updated_at": time.Now(),
	})

	c.JSON(http.StatusOK, gin.H{"message": "Status updated", "completed": newStatus})
}

// DELETE /api/todos/:id
func DeleteTodo(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Todo{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete todo"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
}

// PUT /api/todos/:id
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

	// Update fields
	todo.Title = input.Title
	todo.Description = input.Description
	todo.Priority = input.Priority
	todo.CategoryID = input.CategoryID
	todo.DueDate = input.DueDate
	todo.UpdatedAt = time.Now()

	config.DB.Save(&todo)
	c.JSON(http.StatusOK, todo)
}
