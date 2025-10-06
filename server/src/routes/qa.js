// routes/qaRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import qaService from "../services/qaService.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "QA API is running", time: new Date().toISOString() });
});

router.post(
  "/ask",
  optionalAuth,
  [
    body("question")
      .trim()
      .notEmpty()
      .withMessage("Question is required")
      .isLength({ min: 1, max: 1000 })
      .withMessage("Question must be between 1 and 1000 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question } = req.body;
    const response = await qaService.askQuestion(question, req.user?.uid);
    res.json({ response });
  }
);

router.post(
  "/ask-about-report",
  optionalAuth,
  [
    body("question")
      .trim()
      .notEmpty()
      .withMessage("Question is required")
      .isLength({ min: 1, max: 1000 })
      .withMessage("Question must be between 1 and 1000 characters"),
    body("reportData")
      .notEmpty()
      .withMessage("Report data is required")
      .isObject()
      .withMessage("Report data must be an object"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question, reportData } = req.body;
    const response = await qaService.askAboutReport(question, reportData, req.user?.uid);
    res.json({ response });
  }
);

router.get("/faq", (req, res) => {
  const { limit } = req.query;
  const faqs = qaService.getFAQ(limit || 5);
  res.json({ faqs });
});

export default router;
