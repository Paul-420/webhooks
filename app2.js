// app.js 
const express = require("express"); 
const bodyParser = require("body-parser"); 
const app = express(); 
const PORT = 3000; 
// Middleware to parse JSON bodies 
app.use(bodyParser.json()); 
// Webhook endpoint 
app.post("/webhook", (req, res) => { 
const event = req.body; 
// Process the event 
console.log("Received event:", event); 
// Example: Handle different event types 
if (event.type === "user.signup") { 
1 / 3

 console.log("New user signup:", event.data); 
// Perform actions for new user signup 
} else if (event.type === "order.placed") { 
console.log("Order placed:", event.data); 
// Perform actions for order placed 
} 
// Respond to acknowledge receipt of the event 
res.status(200).send("Event received"); 
}); 
// Start the server 
app.listen(PORT, () => { 
console.log(`Server is running on port ${PORT}`); 
});