package main
//Note: some things may need to be changed based on how the db
//is set up, such as detection struct and parsing through the db
//Outside libraries used are gorilla/mux and lib/pq
//run the following commands
//go mod init test/m
//go get github.com/gorilla/mux
//go get github.com/lib/pq
import (
	"database/sql"
	"encoding/json"
	"log"
	"fmt"
	"net/http"
	"github.com/gorilla/mux"
	_"github.com/lib/pq"
)

//set up connection parameters for PostgreSQL database
const (
	USER = "monomer"
	PASSWORD = "software"
	NAME = "detections"
)

//details the detected box size: top and left make up the top left point of the box.
type Roi struct{
	Top float64 'json:"top"'
	Left float64 'json:"left"'
	Width float64 'json:"width"'
	Height float64 'json:"height"'
}

//details json response
type Response struct{
	Type string 'json:"type"'
	Data Roi 'json:"data"'
	Message string 'json:"message"'
}


//set up and open the database
func setup() *sql.DB{
	//get variables for db
	info := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", USER, PASSWORD, NAME)

	//open database
	database, err := sql.Open("postgres:", info)

	//check for error
	errorCheck(err)

	return database
}


//handle JSON messages
func displayMessage(message string){
	fmt.Println(message)
}


//check handling errors
func errorCheck(er error){
	if er != nil{
		panic(er)
	}
}


//function to get the detected hazards from the database
func getRoi(write http.ResponseWriter, read *http.Request){
	
	//get database
	database := setup()

	//get roi from db
	row, err := database.Query("SELECT * FROM roi")

	//check for any errors
	errorCheck(err)

	//region variable that stores the region of interest
	var region Roi

	//vars to store information about the roi
	var top float64
	var left float64
	var width float64
	var height float64

	//store data into region variable
	region := Roi{Top: top, Left: left, Width: width, Height: height}
		

	//JSON response
	var respond = Response{Type: "ROI", Data: region}

	json.NewEncoder(write).Endcode(respond)
}



func main(){
	
	//initialize mux router
	router := mux.NewRouter()

	//get roi
	router.HandleFunc("/roi/", GetRoi).Methods("GET")

	//create a detection
	//router.HandleFunc("/roi/", CreateDetections).Methods("POST")

	//delete all detections
	//router.HandleFunc("/roi/", DeleteRoi).Methods("DELETE")

	//run
	log.Fatal(http.ListenAndServe(":8000", router))
}