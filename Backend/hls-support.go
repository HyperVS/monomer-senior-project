//get hls video stream from front end
//to run: go run main.go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	//get information from hls vid
	//
	//directory
	//port
	const port = 8080

	//add handler
	//http.Handle("/", addHeaders(http.FileServer(directory)))

	//log errors
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), nil))

}

//addheaders
func addHeaders(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		h.ServeHTTP(w, r)
	}
}
