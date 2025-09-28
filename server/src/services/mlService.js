// import { spawn } from 'child_process';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// class MLService {
//   constructor() {
//     this.pythonExecutable = process.env.PYTHON_EXE || 'python';
//     // Default to model files located in the repository's 'ai model' directory
//     this.modelPath = process.env.SKIN_MODEL_PATH || path.join(__dirname, '../../ai model/skin_disease_resnet50_model.h5');
//     this.classInfoPath = process.env.SKIN_CLASS_INFO_PATH || path.join(__dirname, '../../ai model/class_info_resnet50.json');
//     this.scriptPath = path.join(__dirname, '../ai/predict.py');
//   }

//   async predictImage(imagePath) {
//     const candidates = [
//       this.pythonExecutable,
//       'python3',
//       'py'
//     ];

//     const trySpawn = (exe) => new Promise((resolve, reject) => {
//       const args = [
//         this.scriptPath,
//         '--image', imagePath,
//         '--model', this.modelPath,
//         '--classes', this.classInfoPath
//       ];

//       const proc = spawn(exe, args, { stdio: ['ignore', 'pipe', 'pipe'] });
//       // Helpful debug line to identify which Python exe and paths are used
//       // Remove or guard by env in production if too noisy
//       console.log(`[ML] Executing`, exe, args.join(' '));

//       let stdout = '';
//       let stderr = '';

//       proc.stdout.on('data', (data) => {
//         stdout += data.toString();
//       });

//       proc.stderr.on('data', (data) => {
//         stderr += data.toString();
//       });

//       proc.on('error', (err) => {
//         reject(new Error(`Failed to start '${exe}': ${err.message}`));
//       });

//       proc.on('close', (code) => {
//         if (code !== 0) {
//           return reject(new Error(stderr || `Python exited with code ${code}`));
//         }
//         try {
//           const parsed = JSON.parse(stdout);
//           resolve(parsed);
//         } catch (e) {
//           reject(new Error(`Failed to parse model output: ${e.message}\nOutput: ${stdout}`));
//         }
//       });
//     });

//     let lastError = null;
//     for (const exe of candidates) {
//       try {
//         return await trySpawn(exe);
//       } catch (err) {
//         lastError = err;
//       }
//     }
//     throw lastError || new Error('Failed to execute Python predictor');
//   }
// }

// export default new MLService();


import axios from "axios";
import fs from "fs";
import FormData from "form-data";

class MLService {
  constructor() {
    this.apiUrl =
      process.env.ML_API_URL ||
      "https://rudra0410hf-dermxai.hf.space/predict";
  }

  async predictImage(imagePath) {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(this.apiUrl, formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }
}

export default new MLService();