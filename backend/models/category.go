package models

import "time"

type Category struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" binding:"required"`
	Color     string    `json:"color"`
	CreatedAt time.Time `json:"created_at"`
}
