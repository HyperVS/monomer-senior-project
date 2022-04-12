package models

type Models struct {
	ID       uint   `gorm:"primary_key;auto_increment;not_null"`
	Location string `json:"location"`
	Data     string `json:"data"`
}
