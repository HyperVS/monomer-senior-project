package models

type Models struct {
	ID        uint   `gorm:"primary_key;auto_increment;not_null"`
	Timestamp string `json:"timestamp"`
	Data      string `json:"data"`
}
