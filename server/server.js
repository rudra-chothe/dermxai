import app from "./src/index.js";
import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`🚀 DermX-AI Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});