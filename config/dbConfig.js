const mongoose = require("mongoose");


// const dbURLL = 'mongodb+srv://matunda:afya39@cluster0.3qkr6ko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,ssl: true,useUnifiedTopology: true });
// mongoose.connect(dbURLL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("mongoose is connected"));

module.exports = mongoose;
