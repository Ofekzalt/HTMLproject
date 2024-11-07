exports.getHomePage = (req, res) => {
  res.render("layouts/layout", {
    title: "Home Page",
    body: "../pages/index",
    user: req.user || null, // Send user info if available
  });
};
exports.getLoginPage = (req, res) => {
  console.log("User info:", req.user); // הדפסה לבדוק אם יש מידע על המשתמש

  res.render("layouts/layout", {
    title: "Login Page",
    body: "../pages/login",
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
  });
};
exports.getAboutPage = (req, res) => {
  console.log(user);
  
    res.render("layouts/layout", {
    title: "About Page",
    body: "../pages/about",
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
  });
};
exports.getContactPage = (req, res) => {
  res.render("layouts/layout", {
    title: "Contact Page",
    body: "../pages/contact",
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
  });
};
exports.getRegisterPage = (req, res) => {
  res.render("layouts/layout", {
    title: "Register Page",
    body: "../pages/register",
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
  });
};
exports.getCartPage = (req, res) => {
  res.render("layouts/layout", {
    title: "Cart Page",
    body: "../pages/cart",
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
  });
};
