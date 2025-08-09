# TaskFlow - Full-Stack Task Management Application

A beautiful and feature-rich task management application built with React, TypeScript, and Firebase. TaskFlow helps you organize your work and achieve your goals with an intuitive interface and powerful features.

**🌐 Live Demo:** [https://to-do-tasks-kawin.netlify.app/](https://to-do-tasks-kawin.netlify.app/)

**👨‍💻 Developed by:** MS Kawin

---

## ✨ Features

- 🔐 **Secure Authentication**: Email/password authentication with Firebase Auth
- 📝 **Full CRUD Operations**: Create, read, update, and delete tasks
- 🎯 **Task Status Management**: Track tasks through pending, in-progress, and completed states
- 📅 **Due Date Tracking**: Set due dates and get overdue notifications
- 🔍 **Advanced Filtering**: Filter tasks by status and due date ranges
- 📊 **Real-time Statistics**: View task counts and progress at a glance
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Beautiful UI**: Modern design with violet and green color scheme
- ⚡ **Real-time Updates**: Instant synchronization across devices
- 📄 **Pagination**: Efficient loading with pagination support

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Hook Form for form management
- Lucide React for icons
- Date-fns for date formatting

### Backend
- Firebase Authentication for user management
- Cloud Firestore for data storage
- Firebase Security Rules for data protection

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Set up Firestore Security Rules**
   
   Copy the following rules to your Firebase project's Firestore Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /tasks/{taskId} {
         allow read, write: if request.auth != null && 
           (resource == null || resource.data.userId == request.auth.uid) &&
           (request.resource == null || request.resource.data.userId == request.auth.uid);
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── tasks/           # Task-related components
│   └── ui/              # Base UI components
├── config/              # Configuration files
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── services/            # Firebase service functions
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔥 Firebase Configuration

### Authentication
- Email/Password authentication enabled
- User session management with React Context

### Firestore Database Structure
```
tasks/
├── {taskId}
│   ├── title: string
│   ├── description: string
│   ├── status: 'pending' | 'in-progress' | 'completed'
│   ├── dueDate: timestamp
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   └── userId: string
```

**📊 Database Link:** [View Firestore Database]([https://console.firebase.google.com/project/tasks-65cd6/firestore/databases/-default-/data/~2Fusers~2FTz0bFrDi2TbxxEGkmi5R5Dnglb33](https://console.firebase.google.com/project/task-89c9e/firestore/databases/-default-/data/~2Ftasks~2F3yq5G55eeecpowxFz5eC))

### Security Rules
- Users can only access their own tasks
- All operations require authentication
- Automatic user ID validation

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with subtle animations
- **Color System**: Violet and green theme with proper contrast ratios
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Typography**: Optimized font weights and spacing for readability

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- **Authentication Required**: All operations require user authentication
- **User Isolation**: Users can only see and modify their own tasks
- **Input Validation**: Both client-side and server-side validation
- **Environment Variables**: Sensitive configuration stored securely

## 🚀 Deployment

### Netlify (Current Deployment)
The application is currently deployed on Netlify at: [https://to-do-tasks-kawin.netlify.app/](https://to-do-tasks-kawin.netlify.app/)

### Firebase Hosting (Alternative)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize hosting**
   ```bash
   firebase init hosting
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy
   ```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling system
- Lucide React for beautiful icons
- React Hook Form for form management
- Netlify for hosting services

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Firebase by MS Kawin**

**🌐 Live Application:** [TaskFlow - Task Management App](https://to-do-tasks-kawin.netlify.app/)
