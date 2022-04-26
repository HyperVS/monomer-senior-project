package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nalhinai/roi/database.go"
	"github.com/nalhinai/roi/models"
)

func Create(c *fiber.Ctx) error {
	data := new(models.Models)
	if err := c.BodyParser(data); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	database.DB.Db.Create(&data)
	return c.Status(200).JSON("success")
}

func Read(c *fiber.Ctx) error {
	data := []models.Models{}
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON("no id")
	}
	database.DB.Db.Where("ID = ?", id).Find(&data)
	return c.Status(200).JSON(data)
}
