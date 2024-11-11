require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Product = require('./models/product');
const Message = require('./models/message');
const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to serve static files and parse JSON data
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '10mb' }));

// Routes for static pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'views', 'products.html')));
app.get('/diagnostic', (req, res) => res.sendFile(path.join(__dirname, 'views', 'diagnostic.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));
app.get('/thankyou', (req, res) => res.sendFile(path.join(__dirname, 'views', 'thankyou.html')));

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
