import express from "express"
import jwt from "jsonwebtoken"
import { UserModel, ContentModel } from "./db.js";
import { JWT_SECRET } from "./config.js"
import { userMiddleware } from "./middleware.js";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    await UserModel.create({
        username,
        password,
    })

    res.json({
        message: "sucessfull"
    })

})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_SECRET, {
            expiresIn: "1h"
        })
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})
app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const title = req.body.title;
    const link = req.body.link;
    const tags = req.body.tags;
    const user = req.userId;
    if (!user) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }
    if (title && link) {
        await ContentModel.create({
            title,
            link,
            tags: tags || [],
            userId: user
        })
        res.json({
            message: "Content created successfully"
        })
    }
    else {
        res.status(411).json({
            message: "Enter valid title and link"
        })
    }

})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const user = req.userId;
        if (!user) {
            return res.status(403).json({
                message: "You are not logged in"
            });
        }
        const content = await ContentModel.find({
            userId: user
        }).populate("userId", "username")
        res.json({
            content
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const user = req.userId;
        if (!user) {
            return res.status(403).json({
                message: "You are not logged in"
            });
        }
        const contentId = req.body.id;
        const content = await ContentModel.deleteOne({
            _id: contentId,
            userId: user
        })
        res.json({
            content,
            message: "Content deleted successfully"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.get("/api/v1/brain/:sharelink", (req, res) => {

})

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
