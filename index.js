require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5050;
const warehouseRoutes = require("./routes/warehouse");
const inventoryRoutes = require("./routes/inventory");

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/warehouses", warehouseRoutes);
app.use("/inventories", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
