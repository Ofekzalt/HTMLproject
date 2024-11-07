const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const productsRoutes = require("./routes/Products");
const usersRoutes = require("./routes/Users");
const categoriesRoutes = require("./routes/Categories");
const userController = require("./controllers/userController");
const viewsRouter = require("./routes/viewsRouters");

const app = express();

// MongoDB connection
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@htmlproject.vih2s.mongodb.net/`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", error => console.error("MongoDB connection error:", error));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(morgan("dev"));
// app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("Public"));
app.use(cookieParser());

// CORS Setup
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     if (req.method === "OPTIONS") {
//         res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//         return res.status(200).json({});
//     }
//     next();
// });

// Routes
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/categories", categoriesRoutes);

app.post('/logout', (req, res) => {
    // מחיקת העוגיה עם 'token' בצד השרת
    res.clearCookie('token', {
        path: '/',   // ודא שה-path תואם להגדרת העוגיה
        httpOnly: true,  // אם ה-cookie מוגדר עם httpOnly, יש להוסיף זאת גם כאן
        secure: 'None', // אם אתה בסביבת production, ודא שה-cookie מוגדר כ-secure
    });

    // החזרת תשובה ללקוח
    res.status(200).send({ message: 'התנתקת בהצלחה' });
});
const checkAuth = require('./middlewares/checkAuth');
app.use("/", checkAuth,viewsRouter);  // Handles views like home page in viewsRouter
const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute);  // Handles views like home page in viewsRouter

// Logout Route
app.post("/logout", userController.logOut);

// Other view routes
app.get("/login", (req, res) => res.render("login"));
app.get("/cart", (req, res) => res.render("cart"));

// 404 Error Handling
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// Error Handling Middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: { message: error.message }
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));