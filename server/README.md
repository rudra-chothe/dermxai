# DermX-AI Server

Express.js backend for the DermX-AI dermatology analysis platform with clean architecture separating routes, services, and middleware.

## Features

- **Authentication**: JWT-based user authentication with registration and login
- **Image Analysis**: AI-powered skin condition diagnosis from uploaded images
- **Reports**: Detailed medical reports generation and management
- **Clinical Insights**: Access to dermatological knowledge base and research
- **Q&A Assistant**: AI-powered question answering for dermatology queries
- **Document Analysis**: Extract insights from medical documents and reports

## Architecture

This backend follows a clean architecture pattern:

- **Routes**: Handle HTTP requests and responses only
- **Services**: Contain business logic and data processing
- **Middleware**: Handle cross-cutting concerns (auth, uploads, validation)

## Tech Stack

- **Node.js** with **Express.js**
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **cors** for cross-origin requests
- **morgan** for logging

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

4. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/verify` - Verify JWT token

### Diagnosis

- `POST /api/diagnosis/analyze` - Analyze skin image
- `GET /api/diagnosis/history` - Get analysis history
- `GET /api/diagnosis/:id` - Get specific analysis

### Reports

- `POST /api/reports/generate` - Generate detailed report
- `GET /api/reports` - Get user reports
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/download` - Download report

### Clinical Insights

- `GET /api/insights` - Get clinical insights (with filtering)
- `GET /api/insights/:id` - Get specific insight
- `GET /api/insights/category/:category` - Get insights by category
- `GET /api/insights/trending/popular` - Get trending insights
- `POST /api/insights/search` - Search insights

### Q&A Assistant

- `POST /api/qa/ask` - Ask a question
- `GET /api/qa/faq` - Get frequently asked questions
- `GET /api/qa/search` - Search Q&A database
- `GET /api/qa/category/:category` - Get Q&As by category
- `GET /api/qa/:id` - Get specific Q&A
- `GET /api/qa/user/history` - Get user question history (protected)

### Document Analysis

- `POST /api/documents/analyze` - Upload and analyze document
- `GET /api/documents/history` - Get document history
- `GET /api/documents/:id` - Get document analysis
- `POST /api/documents/:id/extract` - Extract specific information
- `POST /api/documents/search` - Search within documents
- `DELETE /api/documents/:id` - Delete document

### Health Check

- `GET /health` - Server health check

## File Upload

The server supports file uploads for:

- **Images**: JPG, PNG, GIF (max 10MB) for skin analysis
- **Documents**: PDF, DOC, DOCX, TXT (max 10MB) for document analysis

Files are stored in the `uploads/` directory.

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevents abuse
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Request validation with express-validator
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### Project Structure

```
server/
├── src/                    # Source code
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # Authentication middleware
│   │   └── upload.js      # File upload middleware
│   ├── routes/            # API routes (HTTP layer only)
│   │   ├── auth.js        # Authentication routes
│   │   ├── diagnosis.js   # Image analysis routes
│   │   ├── reports.js     # Report generation routes
│   │   ├── insights.js    # Clinical insights routes
│   │   ├── qa.js         # Q&A assistant routes
│   │   └── documents.js   # Document analysis routes
│   └── services/          # Business logic layer
│       ├── authService.js        # Authentication business logic
│       ├── diagnosisService.js   # Image analysis business logic
│       ├── reportsService.js     # Report generation business logic
│       ├── insightsService.js    # Clinical insights business logic
│       ├── qaService.js         # Q&A assistant business logic
│       └── documentsService.js   # Document analysis business logic
├── uploads/               # File upload directory
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Environment Variables

| Variable         | Description              | Default                 |
| ---------------- | ------------------------ | ----------------------- |
| `PORT`           | Server port              | `5000`                  |
| `NODE_ENV`       | Environment              | `development`           |
| `CLIENT_URL`     | Frontend URL for CORS    | `http://localhost:5173` |
| `JWT_SECRET`     | JWT signing secret       | Required                |
| `JWT_EXPIRES_IN` | JWT expiration time      | `7d`                    |
| `MAX_FILE_SIZE`  | Max upload size in bytes | `10485760` (10MB)       |

## Architecture Benefits

### Clean Separation of Concerns

- **Routes**: Only handle HTTP request/response logic
- **Services**: Contain all business logic and data processing
- **Middleware**: Handle cross-cutting concerns

### Easy Testing

- Services can be unit tested independently
- Routes are thin and focus on HTTP concerns
- Mock services easily for integration tests

### Maintainability

- Business logic is centralized in services
- Easy to modify business rules without touching HTTP layer
- Clear dependency flow: Routes → Services

### Scalability

- Services can be easily extracted to microservices
- Business logic is reusable across different interfaces
- Easy to add new routes that use existing services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the architecture patterns
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
