package controllers

import (
	"bytes"
	"encoding/json"
	"industrix-backend/config"
	"industrix-backend/models"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestRouter() *gin.Engine {

	gin.SetMode(gin.TestMode)

	var err error
	config.DB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to in-memory database")
	}

	config.DB.AutoMigrate(&models.Category{}, &models.Todo{})

	r := gin.Default()
	r.GET("/api/todos", GetTodos)
	r.POST("/api/todos", CreateTodo)

	return r
}

func TestCreateTodo(t *testing.T) {

	r := setupTestRouter()

	newTodo := models.Todo{
		Title:       "Test Unit Task",
		Description: "Testing with Go",
		Priority:    "high",
		Completed:   false,
	}
	jsonValue, _ := json.Marshal(newTodo)

	req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	assert.Contains(t, w.Body.String(), "Test Unit Task")

	var savedTodo models.Todo
	config.DB.First(&savedTodo, "title = ?", "Test Unit Task")
	assert.Equal(t, "Test Unit Task", savedTodo.Title)
}

func TestGetTodos(t *testing.T) {
	r := setupTestRouter()

	dummyTodo := models.Todo{
		Title:     "Existing Task",
		Priority:  "medium",
		CreatedAt: time.Now(),
	}
	config.DB.Create(&dummyTodo)

	req, _ := http.NewRequest("GET", "/api/todos?page=1&limit=10", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	assert.Contains(t, w.Body.String(), "Existing Task")
	assert.Contains(t, w.Body.String(), "pagination")
}
