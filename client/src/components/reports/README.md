# Reports Feature

## Overview
The Reports feature allows users to view, download, and discuss their skin analysis reports with an AI assistant.

## Components

### Reports.jsx (Page)
- Displays all user-generated reports in a clean, organized layout
- Shows report details including condition, confidence level, and generation date
- Provides two main actions for each report:
  - **Download PDF**: Downloads the report as a PDF file
  - **Ask AI About Report**: Opens an AI chat interface for report-specific questions

### ReportAIChat.jsx (Component)
- Modal-based AI chat interface specifically for discussing reports
- Provides context-aware responses based on the selected report
- Features:
  - Report summary display at the top
  - Suggested questions for easy interaction
  - Real-time AI responses with confidence levels
  - Smooth animations and responsive design

## API Integration

### Client-side (qaApi.js)
- `askAboutReport(question, reportData)`: Sends report-specific questions to the AI

### Server-side (qa.js routes)
- `POST /api/qa/ask-about-report`: Handles report-specific AI questions
- Validates both question and report data
- Returns contextual responses based on report details

### QA Service (qaService.js)
- `askAboutReport()`: Processes report-specific questions with enhanced context
- Generates report-specific related questions
- Creates specialized prompts for better AI responses

## Features

### Enhanced User Experience
- Smooth animations and hover effects
- Responsive design for all screen sizes
- Loading states and error handling
- Suggested questions for better engagement

### AI Integration
- Context-aware responses based on report data
- Report-specific question suggestions
- Confidence levels for AI responses
- Professional medical disclaimers

### Design System
- Uses DermX color palette (teal, lavender, soft colors)
- Consistent with overall application design
- Accessible and user-friendly interface

## Usage

1. Navigate to the Reports page
2. View your analysis history
3. For each report, you can:
   - Click "Download PDF" to save the report
   - Click "Ask AI About Report" to discuss the report with AI
4. In the AI chat:
   - Ask specific questions about your diagnosis
   - Use suggested questions for guidance
   - Get personalized responses based on your report data

## Technical Details

- Built with React and Tailwind CSS
- Uses custom hooks for state management
- Integrates with existing authentication system
- Follows established API patterns
- Includes proper error handling and loading states