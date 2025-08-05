# CollabCode 🚀
A real-time collaborative coding platform that allows developers to create rooms and code together seamlessly. Built with modern web technologies for optimal performance and user experience.

## ✨ Features
- **Real-time Collaboration**: Two developers can edit the same code simultaneously with peer-to-peer connection
- **WebRTC Integration**: Direct peer-to-peer communication for more enhanced collaborative environment.
- **Room-based System**: Create and join coding rooms with unique identifiers (limited to 2 users per room)
- **Live Code Execution**: Run code instantly with Judge0 API integration
- **Multi-language Support**: Support for popular programming languages
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **User Authentication**: Secure user management and session handling
- **Optimized Data Fetching**: Enhanced performance with React Query for efficient state management

## 🛠️ Tech Stack
### Frontend
- **Next.js** - React framework for production-ready applications
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible React components
- **Socket.IO Client** - Real-time bidirectional event-based communication
- **React Query (TanStack Query)** - Powerful data synchronization and caching
- **WebRTC** - Peer-to-peer real-time communication

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework for Node.js
- **Socket.IO** - Real-time WebSocket communication and signaling for WebRTC
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
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   
   Create `.env` in the backend directory:
   ```env
   PORT=8000
   MONGODB_URI=your-mongodb-connection-string
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

### WebRTC Peer-to-Peer Collaboration
CollabCode now uses WebRTC for direct peer-to-peer communication between collaborators, providing:
- **Two-user limit**: Each room supports exactly 2 developers for optimal performance
- **Reduced server load**: Most communication happens directly between peers

### Real-time Synchronization
- Socket.IO handles WebRTC signaling and room management
- Every keystroke is synchronized in real-time between the two connected peers

### Code Execution
Integration with Judge0 API allows users to run their collaborative code in multiple programming languages including:
- Python
- Java
- C++
- C
- And many more!

### Room Management
- Create unique rooms with custom names
- Share room codes with one collaborator (2-user maximum)

### Data Management
- **React Query** integration for efficient API calls and caching
- Optimized data fetching and synchronization

## 📝 Usage Notes
- **Room Capacity**: Each room is limited to 2 users for optimal peer-to-peer performance
- **Connection Requirements**: Both users must have WebRTC-compatible browsers
- **Network**: Works best with stable internet connections for seamless collaboration

## 📞 Support
If you have any questions or need help, please:
- Open an issue on GitHub
- Check the WebRTC compatibility of your browser
- Ensure firewall settings allow P2P connections

---
**Built with ❤️ by Ritik**
