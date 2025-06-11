const mongoose = require("mongoose");


mongoose.connect(process.env.DB_URL);

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
});

const userModel = mongoose.model("users", UserSchema);

module.exports = {
    userModel
};