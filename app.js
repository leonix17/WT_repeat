require('dotenv').config();

const express = require('express'); // Import express
const methodOverride = require('method-override');
const session = require('express-session'); // Import session
const connectDB = require('./server/config/db'); // Import database connection
const { isActiveRoute } = require('./server/helpers/route_helpers');
const expressLayout = require('express-ejs-layouts'); // Import express-ejs-layouts
const cookieParser = require('cookie-parser'); // Import cookie-parser
const MongoStore = require('connect-mongo'); // Import connect-mongo

const app = express(); // Create express application

const PORT = process.env.PORT || 5000; // Set port with fallback

// Connect to the database
connectDB();

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(methodOverride('_method')); // Middleware for method override

app.use(session({
    secret: 'keyboard cat', // Secret for session encryption
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI // MongoDB URI from environment variables
    })
    // cookie: { maxAge: new Date ( Date.now() + (3600000) ) } // Optional cookie settings
}));

app.use(express.static('public')); // Serve static files from 'public' directory

// Templating Engine Setup
app.use(expressLayout); // Use express-ejs-layouts for layouts
app.set('layout', './layouts/main'); // Set default layout
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.locals.isActiveRoute = isActiveRoute;

// Route Handlers
app.use('/', require('./server/routes/main')); // Main routes
app.use('/admin', require('./server/routes/admin')); // Admin routes

// Start server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});