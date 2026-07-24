import { type NextFunction, type Request, type Response } from "express";
import { JWT_SECRET } from "./config.js";
import Jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }
    const token = authHeader.split(" ")[1]!;
    try {
        const decodedValue = Jwt.verify(token, JWT_SECRET) as { id: string };
        req.userId = decodedValue.id;
    }
    catch {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }
    next();
}