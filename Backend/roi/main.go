package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/nalhinai/roi/database.go"
	"github.com/nalhinai/roi/handlers"
)

func handler(app *fiber.App) {
	app.Post("/create", handlers.Create)
	app.Get("/read/:id", handlers.Read)
}

func main() {
	database.ConnectDb()
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		Next:             nil,
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE",
		AllowHeaders:     "",
		AllowCredentials: true,
		ExposeHeaders:    "",
		MaxAge:           999999,
	}))
	handler(app)
	log.Fatal(app.Listen(":8000"))
}
