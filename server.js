const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Product = require('./models/product');
const Message = require('./models/message');
const app = express();
const port = process.env.PORT || 5000;

// MongoDB URI directly in the code
const MONGO_URI = 'mongodb+srv://baviskarsaurabh123:96GpxaTMZDrlqcJK@product.me3ns.mongodb.net/?retryWrites=true&w=majority&appName=product';

// Log the MongoDB URI to ensure it's set correctly
console.log('MongoDB URI:', MONGO_URI);

// Check if the MONGO_URI is defined
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined');
    process.exit(1); // Exit if MONGO_URI is not defined
}

// MongoDB connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to serve static files and parse JSON data
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '10mb' }));

// Routes for static pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'public', 'products.html')));
app.get('/diagnostic', (req, res) => res.sendFile(path.join(__dirname, 'public', 'diagnostic.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/thankyou', (req, res) => res.sendFile(path.join(__dirname, 'public', 'thankyou.html')));

// Route to handle form submission and save messages to MongoDB
app.post('/send-message', async (req, res) => {
    const { name, email, message } = req.body;

    // Backend validation for missing fields
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        res.json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find(); // Assuming Product is your model
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to load products' });
    }
});

// Route for AI-based plant disease analysis
app.post('/api/analyze', (req, res) => {
    const { image } = req.body;
    const { disease, recommendation } = detectDisease(image);

    res.json({ disease, recommendation });
});

// Placeholder for image analysis function (replace with actual AI model)
function detectDisease(image) {
    return {
        disease: "Powdery Mildew",
        recommendation: "Apply Sulfur-based Fungicide"
    };
}

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});   
 