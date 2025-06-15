# CultureFix - Full Stack Application

A comprehensive culture management and feedback platform built with Next.js and Node.js.

## 🚀 Live Demo

- **Frontend**: [https://100networks.com](https://100networks.com)
- **Backend API**: http://13.62.13.0:3001

## 📋 Project Structure

```
100N-FINAL-ProjectAnalysis/
├── Final UI/              # Next.js Frontend Application
├── backend/               # Node.js/Express Backend API
├── Login Signup Landing/  # Authentication Pages
├── .github/workflows/     # GitHub Actions for CI/CD
├── deployment-config.env  # Server Configuration
├── deploy.sh             # Linux/Mac Deployment Script
├── deploy.ps1            # Windows PowerShell Deployment Script
└── DEPLOYMENT_GUIDE.md   # Detailed Deployment Instructions
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hooks
- **Authentication**: Firebase

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Upload**: Multer

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 16+ installed
- PostgreSQL installed (for backend)
- Git installed

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yash251293/100N-FINAL.git
   cd 100N-FINAL
   git checkout project-analysis
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Individual Component Setup

#### Frontend Setup
```bash
cd "Final UI"
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

## 🚀 Deployment

### Option 1: Automated GitHub Pages (Frontend Only)

The frontend automatically deploys to GitHub Pages when you push to the `project-analysis` branch.

**URL**: https://100networks.com

### Option 2: Full Server Deployment (Frontend + Backend)

#### Windows (PowerShell)
```powershell
# Fix and run the deployment script
.\deploy.ps1
```

#### Linux/Mac
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Manual Server Setup
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed manual deployment instructions.

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturefix_db
DB_USER=culturefix_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_here
```

### Deployment Configuration

Edit `deployment-config.env` with your server details:
```env
SERVER_IP=your.server.ip.address
SERVER_USER=your_username
DOMAIN=your-domain.com
```

## 📁 Key Features

- **User Authentication**: Secure login/signup with Firebase
- **Dashboard**: Interactive culture management dashboard
- **Feedback System**: Comprehensive feedback collection and analysis
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-friendly interface
- **Admin Panel**: Administrative controls and analytics

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - User login  
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Culture Management
- `GET /api/culture` - Get culture data
- `POST /api/culture` - Create culture entry
- `PUT /api/culture/:id` - Update culture entry
- `DELETE /api/culture/:id` - Delete culture entry

### Feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:id` - Get specific feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Yash
- **Repository**: [100N-FINAL](https://github.com/yash251293/100N-FINAL)

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yash251293/100N-FINAL/issues) page
2. Review the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Create a new issue with detailed information

## 📈 Project Status

- ✅ Frontend Development Complete
- ✅ Backend API Complete  
- ✅ Database Integration Complete
- ✅ Authentication System Complete
- ✅ GitHub Pages Deployment Setup
- ✅ Server Deployment Scripts
- 🔄 Continuous Integration/Deployment

---

**Made with ❤️ by Yash** 