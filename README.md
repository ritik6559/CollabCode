# CollabCode 🚀

A real-time collaborative coding platform that allows developers to create rooms and code together seamlessly. Built with modern web technologies for optimal performance and user experience.

## 🎥 Live Demo
Check out CollabCode in action! Watch the demo video to see how easy it is to collaborate on code in real-time:

https://github.com/user-attachments/assets/4256a100-800c-4967-bde1-4c2d5e0c11a1


## ✨ Features

- **Real-time Collaboration**: Multiple users can edit the same code simultaneously
- **Room-based System**: Create and join coding rooms with unique identifiers
- **Live Code Execution**: Run code instantly with Judge0 API integration
- **Multi-language Support**: Support for popular programming languages
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Syntax Highlighting**: Beautiful code editor with syntax highlighting
- **User Authentication**: Secure user management and session handling

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production-ready applications
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible React components
- **Socket.IO Client** - Real-time bidirectional event-based communication

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework for Node.js
- **Socket.IO** - Real-time WebSocket communication
- **MongoDB** - NoSQL database for flexible data storage
- **Judge0 API** - Code execution engine for multiple programming languages

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ritik6559/CollabCode.git
   cd CollabCode
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create `.env.local` in the frontend directory:
   ```env
   JUDGE0_API_KEY=your-judge0-api-key
   ```

   Create `.env` in the backend directory:
   ```env
   PORT=8080
   MONGODB_URI=
   JWT_SECRET=your-secret-key

   ```

4. **Start the development servers**

   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to start using CollabCode!

## 🔧 Key Components

### Real-time Collaboration
Socket.IO enables real-time synchronization of code changes across all connected users in a room. Every keystroke is broadcasted to maintain consistency.

### Code Execution
Integration with Judge0 API allows users to run their collaborative code in multiple programming languages including:
- Python
- Java
- C++
- C
- And many more!

### Room Management
- Create unique rooms with custom names
- Share room codes with collaborators

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub

---

**Built with ❤️ by Ritik**
