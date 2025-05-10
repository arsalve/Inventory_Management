const mongoose = require('mongoose');
const Inventory = require('./src/models/inventoryModel');
const Customer = require('./src/models/customerModel');
const Supplier = require('./src/models/supplierModel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const createDummyData = async () => {
    try {
        // Clear existing data
        await Customer.deleteMany({});
        console.log('Existing customers cleared.');

        // Create suppliers
        const suppliers = [
     ];
        const savedSuppliers = await Supplier.insertMany(suppliers);

        // Create customers
        const customers = [
            { name: 'Customer 1', email: 'customer1@example.com', phone: '1234567890', address: '123 Customer St' },
            { name: 'Customer 2', email: 'customer2@example.com', phone: '0987654321', address: '456 Customer Ave' },
            { name: 'Plastic Manufacturer', email: 'manufacturer@example.com', phone: '7778889999', address: '202 Manufacturer Ln' },
            { name: 'Office Supplies Buyer', email: 'buyer@example.com', phone: '0001112222', address: '303 Buyer St' }
        ];
        const savedCustomers = await Customer.insertMany(customers);

        // Create inventory items
        const items = [];
        for (let i = 1; i <= 20; i++) {
            items.push({
                name: `Plastic Item ${i}`,
                quantity: Math.floor(Math.random() * 1000),
                price: Math.random() * 100,
                receivePrice: Math.random() * 80,
                sellPrice: Math.random() * 120,
                addedDate: new Date(`2024-12-${Math.floor(Math.random() * 30) + 1}`),
                itemType: 'Plastic',
                usageHistory: [
                    { user: `User ${i}`, reason: `Reason ${i}`, quantityUsed: Math.floor(Math.random() * 50), customer: savedCustomers[0]._id }
                ]
            });
        }
        await Inventory.insertMany(items);

        console.log('Dummy data created successfully');
    } catch (error) {
        console.log('Error creating dummy data:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

createDummyData();
