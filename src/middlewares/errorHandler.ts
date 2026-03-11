import { NextFunction, Request, Response } from "express";
import Sequelize from "sequelize";
import { z } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    err instanceof Sequelize.ValidationError ||
    err.code === "VALIDATION_ERROR"
  ) {
    const errors = err.errors.map((error: any) => {
      return {
        field: error.path,
        message: error.message,
      };
    });

    return res.status(400).json({ errors, type: "VALIDATION_ERROR" });
  }

  if (err instanceof z.ZodError) {
    const parsedErrors = JSON.parse(err.message);

    const errors = parsedErrors.map((error: any) => {
      return {
        field: error.path[0],
        message: error.message,
      };
    });

    return res.status(400).json({ errors, type: "VALIDATION_ERROR" });

    // res.status(400).json({ error: "Invalid request data" });
    return;
  }

  const statusCode = err.status || 400;
  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).json({ message });
};
