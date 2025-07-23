# Full-Stack Expense Tracking Application

A comprehensive expense tracking system built for remote teams with role-based access control, visual analytics, and audit logging capabilities.

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure email/password login system
- **Role-Based Access Control**: Two user roles with different permissions
  - **Employee**: Can manage their own expenses (create, view)
  - **Admin**: Can view all expenses, approve/reject, access analytics and audit logs

### Expense Management
- **Employee Features**:
  - Add new expenses with amount, category, date, and notes
  - View personal expense history
  - Filter expenses by status, category, and date range
  - Real-time status updates

- **Admin Features**:
  - View all team expenses in one dashboard
  - Filter and search through all expenses
  - Approve or reject pending expenses
  - Bulk expense management capabilities

### Analytics Dashboard (Admin Only)
- **Category Analysis**: Interactive bar chart showing total expenses by category
- **Trend Analysis**: Line chart displaying expense trends over time (monthly breakdown)
- **Summary Statistics**: Total approved expenses, transaction counts, and averages
- **Real-time Data**: Auto-refreshing analytics every 60 seconds

### Audit Logging
- **Comprehensive Tracking**: Logs all critical actions including:
  - User registration and login
  - Expense creation and updates
  - Status changes (pending → approved/rejected)
- **Admin Visibility**: Detailed audit trail with timestamps and user information
- **Activity Monitoring**: Track team expense activities for compliance

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React.js** 
- **React Router** for navigation
- **Axios** for API communication
- **Chart.js** with **react-chartjs-2** for data visualization
- **Tailwind CSS** for styling
- **Context API** for state management

## 📋 Prerequisites

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expense-tracker-fullstack
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Backend Configuration
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend Configuration (for development)
VITE_API_URL=http://localhost:5000/api
```

**Important**: Replace the MongoDB URI with your actual connection string.

### 4. Start the Application
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 👥 User Roles & Permissions

### Employee Role
- ✅ Register and login
- ✅ Create new expenses
- ✅ View personal expenses
- ✅ Filter personal expense history
- ❌ View other users' expenses
- ❌ Approve/reject expenses
- ❌ Access analytics dashboard
- ❌ View audit logs

### Admin Role
- ✅ All employee permissions
- ✅ View all team expenses
- ✅ Approve/reject any expense
- ✅ Access analytics dashboard
- ✅ View comprehensive audit logs
- ✅ Filter and manage all expenses

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Expenses
- `GET /api/expenses` - Get expenses (filtered by role)
- `POST /api/expenses` - Create new expense
- `PATCH /api/expenses/:id/status` - Update expense status (admin only)
- `GET /api/expenses/analytics/category` - Category analytics (admin only)
- `GET /api/expenses/analytics/trends` - Trend analytics (admin only)

### Audit Logs
- `GET /api/audit` - Get audit logs (admin only)

## 🎨 UI/UX Features

### Design Elements
- **Modern Interface**: Clean, professional design with intuitive navigation
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Color Scheme**: 
  - Primary Blue (#3B82F6) for main actions
  - Secondary Green (#10B981) for success states
  - Accent Orange (#F97316) for highlights
- **Interactive Elements**: Hover effects, smooth transitions, and micro-interactions
- **Visual Feedback**: Loading states, success/error messages, and status indicators

### User Experience
- **Role-based Navigation**: Dynamic sidebar based on user permissions
- **Real-time Updates**: Automatic data refresh and instant status updates
- **Filtering & Search**: Advanced filtering options for expense management
- **Data Visualization**: Interactive charts with tooltips and legends
- **Form Validation**: Client-side and server-side validation with clear error messages

## 🔧 Development

### Project Structure
```
expense-tracker-fullstack/
├── server/                 # Backend code
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   └── server.js          # Main server file
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context
│   ├── services/         # API services
│   └── App.jsx           # Main app component
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

### Available Scripts
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection is accessible
3. Build and deploy the server directory

### Frontend Deployment
1. Update API URLs in environment variables
2. Run `npm run build` to create production build
3. Deploy the `dist` folder to your hosting platform

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Authorization**: Middleware protection for admin routes
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin resource sharing

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify your MongoDB URI in the `.env` file
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB service is running (for local installations)

**Port Already in Use**
- Change the PORT in `.env` file
- Kill existing processes using the ports

**Authentication Issues**
- Clear browser localStorage
- Check JWT_SECRET in environment variables
- Verify token expiration settings

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for remote teams**
