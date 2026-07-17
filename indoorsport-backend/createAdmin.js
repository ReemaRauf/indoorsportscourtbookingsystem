require("dotenv").config();
const { db } = require("./firebase");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const email = "admin@indoorsport.com";
    const password = "adminpassword"; // Change this in production
    const name = "Admin";
    
    // Check if admin already exists
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (!snapshot.empty) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      phone: "0000000000",
      createdAt: new Date().toISOString()
    });

    console.log("Admin user created successfully! Email: admin@indoorsport.com, Password: adminpassword");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
