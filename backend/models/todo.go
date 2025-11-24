package models

import (
	"time"
)

type Todo struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	Title       string     `json:"title" binding:"required"`
	Description string     `json:"description"`
	Completed   bool       `json:"completed"`
	CategoryID  *uint      `json:"category_id"` // Pointer allows null
	Category    *Category  `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Priority    string     `json:"priority" binding:"oneof=high medium low"` // Validation
	DueDate     *time.Time `json:"due_date"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// PaginationResponse structure [cite: 79]
type PaginationMeta struct {
	CurrentPage int   `json:"current_page"`
	PerPage     int   `json:"per_page"`
	Total       int64 `json:"total"`
	TotalPages  int   `json:"total_pages"`
}

type TodoResponse struct {
	Data       []Todo         `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
}
