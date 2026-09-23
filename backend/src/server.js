const express = require("express");
require("dotenv").config();
const claimRoutes = require("./routes/claim.routes");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use("/api", auth);
app.use("/api/claims", auth, claimRoutes);

// app.get("/api/health", (req, res) => {
//     res.json({
//         status: "ok",
//     });
// });

const PORT = 3001;


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});