# BirrWise 💸

### *University Student Expense Tracker & Budget Manager*

BirrWise is a professional-grade mobile application built to help university students manage their finances efficiently. It features a robust MERN stack backend and a React Native mobile frontend.

---

## 📚 Academic Documentation
This project includes comprehensive documentation required for academic evaluation:

1.  **[01 Deep Study & Analysis](docs/01_Analysis_Study.md)**: User interviews, pain points, and real-world scenarios.
2.  **[02 Requirements Specification](docs/02_Requirements_Spec.md)**: Functional and Non-functional requirements, user stories.
3.  **[03 System Design](docs/03_System_Design.md)**: Architecture, ERD, and API design.
4.  **[04 Testing Documentation](docs/04_Testing_Plan.md)**: Test cases, strategy, and UAT.

---

## 🚀 Key Features
- **Smart Tracking**: Easily record income and expenses with categories.
- **Budgeting**: Set weekly/monthly limits to avoid overspending.
- **Analytics**: Beautiful visual insights into your spending habits.
- **Student-Centric**: Focused on student needs like stipends, snacks, and stationery.
- **Secure**: JWT authentication and Bcrypt password hashing.

---

## 🛠 Tech Stack
- **Frontend**: React Native, Redux Toolkit, React Navigation.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Security**: JWT, Helmet, Express-Rate-Limit.

---

## 🏁 Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Configure `.env` (MONGO_URI, JWT_SECRET, PORT)
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Check `src/api/axios.js` for Base URL configuration.
4. `npx expo start`
