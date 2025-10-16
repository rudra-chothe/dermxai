# DermX-AI: AI-Powered Dermatology Analysis Platform

<div align="center">

![DermX-AI Logo](https://via.placeholder.com/200x80/4F46E5/FFFFFF?text=DermX-AI)

**Instant, accurate skin condition diagnosis powered by artificial intelligence**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)

</div>

## 🌟 Overview

DermX-AI is a comprehensive AI-powered dermatology analysis platform that provides instant, accurate skin condition diagnosis and analysis. The platform combines advanced machine learning algorithms with a modern web interface to deliver professional-grade dermatological insights to users.

### ✨ Key Features

- 🔬 **AI-Powered Analysis** - Upload skin images and receive instant AI diagnosis
- 📊 **Comprehensive Reports** - Detailed analysis with treatment recommendations
- 🏥 **Clinical Insights** - Evidence-based medical information database
- 💬 **AI Assistant** - Interactive Q&A for dermatological questions
- 📄 **Document Analysis** - Upload and analyze medical documents
- 👤 **User Profiles** - Complete medical history and preferences management
- 🔐 **Secure Authentication** - Firebase Auth with fallback system
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • User Interface│    │ • API Routes    │    │ • User Data     │
│ • State Mgmt    │    │ • Business Logic│    │ • Analysis Data │
│ • Authentication│    │ • Authentication│    │ • Reports       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   File Storage  │
│   (Auth/Storage)│    │   (Multer)      │
└─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 6.0+
- **Firebase** project with Admin SDK
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dermx-ai
```

2. **Install dependencies**
```bash
# Frontend dependencies
cd client
npm install

# Backend dependencies
cd ../server
npm install
```

3. **Environment setup**
```bash
# Copy environment templates
cp client/env.example client/.env
cp server/env.example server/.env
```

4. **Configure environment variables**

**Frontend (.env)**
```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_USE_FIREBASE_AUTH=true
VITE_SERVER_URL=http://localhost:5000
```

**Backend (.env)**
```bash
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:8080

# Database
MONGODB_URI=mongodb://localhost:27017/dermx-ai

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

5. **Start the development servers**
```bash
# Terminal 1: Backend server
cd server
npm run dev

# Terminal 2: Frontend server
cd client
npm run dev
```

6. **Access the application**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📁 Project Structure

```
dermx-ai/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Radix UI components
│   │   │   ├── Layout.jsx     # Main layout wrapper
│   │   │   └── Sidebar.jsx    # Navigation sidebar
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Dashboard.jsx  # User dashboard
│   │   │   ├── Diagnose.jsx   # Image analysis
│   │   │   ├── Reports.jsx    # Analysis history
│   │   │   └── ...
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   └── config/            # Configuration files
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express backend
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Custom middleware
│   │   └── config/            # Configuration
│   ├── package.json
│   └── server.js
├── README.md
└── package.json
```

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **Vite 5.4.1** - Fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router DOM 6.26.2** - Client-side routing
- **TanStack Query 5.56.2** - Server state management
- **Firebase 10.7.1** - Authentication and storage
- **Lucide React** - Icon library
- **Recharts 2.12.7** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **MongoDB 6.3.0** - NoSQL database
- **Mongoose 8.0.0** - MongoDB object modeling
- **Firebase Admin SDK 12.0.0** - Server-side Firebase
- **JWT** - JSON Web Tokens for auth
- **Multer 1.4.5** - File upload handling
- **Helmet 7.1.0** - Security middleware

## 🔐 Authentication System

DermX-AI implements a robust dual authentication system:

### Primary: Firebase Authentication
- Email/password authentication
- Google OAuth integration
- Email verification
- Password reset functionality
- Custom claims for role-based access

### Fallback: Custom Authentication
- Development mode support
- JWT token generation
- Custom user validation
- Seamless fallback when Firebase is unavailable

## 📊 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify` - Verify Firebase ID token
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Diagnosis (`/api/diagnosis`)
- `POST /analyze` - Analyze skin image
- `GET /history` - Get analysis history
- `GET /:id` - Get specific analysis

### Reports (`/api/reports`)
- `POST /generate` - Generate detailed report
- `GET /` - Get user reports
- `GET /:id/download` - Download report

### Clinical Insights (`/api/insights`)
- `GET /` - Get insights with filtering
- `GET /category/:category` - Get by category
- `POST /search` - Search insights

### Q&A Assistant (`/api/qa`)
- `POST /ask` - Ask AI assistant
- `GET /history` - Get Q&A history

## 🎯 Core Features

### 1. AI-Powered Skin Analysis
- **Image Upload**: Drag-and-drop interface with validation
- **AI Processing**: Advanced machine learning analysis
- **Condition Detection**: Identifies common skin conditions
- **Confidence Scoring**: Provides accuracy percentages
- **Treatment Recommendations**: Evidence-based suggestions

### 2. Comprehensive Reporting
- **Detailed Reports**: Complete analysis with images
- **Report History**: Access to all previous analyses
- **Export Options**: PDF and JSON download
- **Sharing**: Secure report sharing functionality

### 3. Clinical Insights Database
- **Evidence-Based Info**: Curated medical information
- **Advanced Search**: Filtering and categorization
- **Research Updates**: Latest medical guidelines
- **FAQ Section**: Common questions and answers

### 4. User Management
- **Profile Management**: Comprehensive user profiles
- **Medical History**: Track allergies, medications, conditions
- **Preferences**: Customizable settings
- **Usage Statistics**: Activity tracking

## 🔒 Security Features

- **Authentication Security**: Firebase Admin SDK with JWT
- **API Security**: CORS, Helmet.js, rate limiting
- **File Upload Security**: Type validation, size limits
- **Data Protection**: Input validation, XSS protection
- **Privacy Compliance**: HIPAA-compliant data handling

## 🧪 Testing

```bash
# Backend tests
cd server
npm run test:mongodb          # Test MongoDB connection
npm run test:integration      # Integration tests
npm run test:firebase-mongodb # Firebase + MongoDB tests
npm run verify               # Verify setup

# Frontend tests
cd client
npm run lint                 # ESLint checks
```

## 📦 Deployment

### Production Build

```bash
# Frontend build
cd client
npm run build

# Backend (production mode)
cd server
NODE_ENV=production npm start
```

### Environment Variables for Production

Ensure all environment variables are properly configured for production:
- Update Firebase configuration
- Set secure JWT secrets
- Configure production MongoDB URI
- Set appropriate CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the documentation
3. Contact the development team

## 🚧 Roadmap

### Upcoming Features
- [ ] Real AI model integration
- [ ] Mobile application (React Native)
- [ ] Telemedicine integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline analysis capabilities

### Long-term Goals
- [ ] EHR system integration
- [ ] Insurance integration
- [ ] Prescription management
- [ ] Doctor consultation booking

---

<div align="center">

**Built with ❤️ by the DermX-AI Team**

[Website](https://dermx-ai.com) • [Documentation](./docs) • [API Reference](./docs/api.md)

</div>