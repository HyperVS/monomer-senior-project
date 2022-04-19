package models

//Details the format saved for the JSON file and database
//ID: primary key and entry number
//Location: User selected if they want to alert from inside or outside the ROI.
//Location will be either "inside" or "outside"
//Data: string containing the points of the ROI in the format "Top: y, Left: x, Width: w, Height: h"
//Select: string of what the user wants to detect.
//Select will equal either "hardhat" or "no_hardhat"
type Models struct {
	ID       uint   `gorm:"primary_key;auto_increment;not_null"`
	Location string `json:"location"`
	Data     string `json:"data"`
	Select   string `json:"select"`
}
