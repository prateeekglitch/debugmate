
# 🎓 DebugMate: A Peer-to-Peer Collaborative Learning Platform

DebugMate is a high-performance, full-stack social learning environment designed to help students and developers find study partners, exchange technical skills, and solve complex challenges through real-time collaboration. 

Built with the MERN stack, this platform focuses on "Learning by Teaching" (The Feynman Technique) to help users master new concepts together.

![Platform Preview](/frontend/public/screenshot-for-readme.png)

## 🌟 Project Purpose & Vision
As a student pivoting into high-end software development, I recognized that solo learning can often lead to stagnation. DebugMate was engineered to:
- **Connect Global Learners:** Break geographical barriers to find peers with similar learning trajectories (DSA, Web Dev, Languages).
- **Facilitate Pair Programming:** Use integrated video and screen-sharing to debug logic in real-time.
- **Master UI/UX Flexibility:** Offer 32 unique UI themes (DaisyUI) to allow users to customize their workspace for maximum productivity.

## 🚀 Technical Architecture
- **Real-time Engine:** Instant messaging with typing indicators and reactions powered by Stream.
- **HD Video Infrastructure:** Group and 1-on-1 video calling with **Screen Sharing** capabilities.
- **Global State:** Lightweight and optimized state management using **Zustand**.
- **Data Synchronization:** **TanStack Query** for efficient caching and server-state management.
- **Secure Auth:** Industry-standard **JWT Authentication** with HTTP-only cookies to prevent XSS/CSRF attacks.
- **Scalable Backend:** Node.js & Express architecture designed for high throughput.

## 🧪 Environment Configuration

To run this project, you will need to set up the following environment variables.

### Backend (`/backend/.env`)
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
STEAM_API_KEY=your_stream_api_key      # Using 'STEAM' to match project-wide naming
STEAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_secure_random_string
NODE_ENV=production

```

### Frontend (`/frontend/.env`)

```env
VITE_STREAM_API_KEY=your_stream_api_key

```

## 🛠️ Installation & Execution

1. **Clone the Repository:**
```bash
git clone [https://github.com/prateeekglitch/debugmate.git](https://github.com/prateeekglitch/debugmate.git)
cd debugmate

```


2. **Backend Setup:**
```bash
cd backend
npm install
npm start

```


3. **Frontend Setup:**
```bash
cd ../frontend
npm install
npm run dev

```



## 📈 Roadmap & Future Scope

* [ ] **AI Mentor Integration:** Automated code reviews for common student errors.
* [ ] **Collaborative Code Editor:** Real-time shared IDE inside the video call.
* [ ] **Study Streaks:** Gamification to help students maintain daily learning habits.

---

**Developed by [Prateek]** *Driven by curiosity and a commitment to collaborative engineering.*

```

```