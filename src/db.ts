import mongoose, { model, Model, Schema } from "mongoose";

mongoose.connect("mongodb://localhost:27017/Brainly")

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },

})

const contentSchema = new Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export const ContentModel = model("Content", contentSchema);
export const UserModel = model("User", UserSchema);
