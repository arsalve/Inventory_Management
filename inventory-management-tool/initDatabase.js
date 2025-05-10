const mongoose = require('mongoose');
const Inventory = require('./src/models/inventoryModel');
const Customer = require('./src/models/customerModel');
const Supplier = require('./src/models/supplierModel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const flushAndCreateData = async () => {
    try {
        // Flush existing data
        await Inventory.deleteMany({});
        await Customer.deleteMany({});
        await Supplier.deleteMany({});
        console.log('Existing data flushed');

        // Create suppliers
        const suppliers = [
            { name: 'Supplier 1', email: 'supplier1@example.com', phone: '1234567890', address: '123 Supplier St' },
            { name: 'Supplier 2', email: 'supplier2@example.com', phone: '0987654321', address: '456 Supplier Ave' }
        ];
        const savedSuppliers = await Supplier.insertMany(suppliers);

        // Create customers
        const customers = [
            { name: 'Customer 1', email: 'customer1@example.com', phone: '1234567890', address: '123 Customer St' },
            { name: 'Customer 2', email: 'customer2@example.com', phone: '0987654321', address: '456 Customer Ave' }
        ];
        const savedCustomers = await Customer.insertMany(customers);

        // Create inventory items
        const items = [];
        for (let i = 1; i <= 20; i++) {
            items.push({
                name: `Plastic Item ${i}`,
                quantity: Math.floor(Math.random() * 1000),
                price: (Math.random() * 100).toFixed(2),
                receivePrice: (Math.random() * 80).toFixed(2),
                sellPrice: (Math.random() * 120).toFixed(2),
                expiryDate: new Date(`2024-12-${Math.floor(Math.random() * 30) + 1}`),
                itemType: 'Plastic',
                usageHistory: [
                    { user: savedCustomers[0].name, reason: `Reason ${i}`, quantityUsed: Math.floor(Math.random() * 50), customer: savedCustomers[0].name }
                ]
            });
            items.push({
                name: `Recycled Plastic Item ${i}`,
                quantity: Math.floor(Math.random() * 1000),
                price: (Math.random() * 100).toFixed(2),
                receivePrice: (Math.random() * 80).toFixed(2),
                sellPrice: (Math.random() * 120).toFixed(2),
                expiryDate: new Date(`2024-12-${Math.floor(Math.random() * 30) + 1}`),
                itemType: 'Recycled Plastic',
                usageHistory: [
                    { user: savedCustomers[1].name, reason: `Reason ${i}`, quantityUsed: Math.floor(Math.random() * 50), customer: savedCustomers[1].name }
                ]
            });
            items.push({
                name: `Office Supply ${i}`,
                quantity: Math.floor(Math.random() * 1000),
                price: (Math.random() * 100).toFixed(2),
                receivePrice: (Math.random() * 80).toFixed(2),
                sellPrice: (Math.random() * 120).toFixed(2),
                expiryDate: new Date(`2024-12-${Math.floor(Math.random() * 30) + 1}`),
                itemType: 'Office Supply',
                usageHistory: [
                    { user: savedCustomers[0].name, reason: `Reason ${i}`, quantityUsed: Math.floor(Math.random() * 50), customer: savedCustomers[0].name }
                ]
            });
            items.push({
                name: `Generic Item ${i}`,
                quantity: Math.floor(Math.random() * 1000),
                price: (Math.random() * 100).toFixed(2),
                receivePrice: (Math.random() * 80).toFixed(2),
                sellPrice: (Math.random() * 120).toFixed(2),
                expiryDate: new Date(`2024-12-${Math.floor(Math.random() * 30) + 1}`),
                itemType: 'Generic',
                usageHistory: [
                    { user: savedCustomers[1].name, reason: `Reason ${i}`, quantityUsed: Math.floor(Math.random() * 50), customer: savedCustomers[1].name }
                ]
            });
        }
        await Inventory.insertMany(items);

        console.log('New data created successfully');
    } catch (error) {
        console.log('Error creating new data:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

flushAndCreateData();
