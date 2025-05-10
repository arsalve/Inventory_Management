const { Inventory } = require('../models/inventoryModel');

exports.getReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let start, end;

        // Parse and validate the date range
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);

            if (isNaN(start) || isNaN(end)) {
                return res.status(400).json({ message: 'Invalid date format.' });
            }
        } else {
            // Default to fetching all data if no date range is provided
            start = new Date(2000, 0, 1); // Arbitrary start date
            end = new Date(); // Current date
        }

        console.log('Start Date:', start, 'End Date:', end);

        // Fetch used items within the date range
        const usedItems = await Inventory.find({
            'usageHistory.date': { $gte: start, $lte: end }
        }).populate('usageHistory.customer', 'name');

        // Fetch available items received within the date range
        const availableItems = await Inventory.find({
            'receivedDate': { $gte: start, $lte: end }
        });

        // Calculate total sale amount for the selected date range
        const totalSaleAmount = usedItems.reduce((sum, item) => {
            return sum + item.usageHistory.reduce((subSum, history) => {
                if (history.date >= start && history.date <= end) {
                    return subSum + (item.sellPrice * history.quantityUsed);
                }
                return subSum;
            }, 0);
        }, 0);

        // Calculate total purchase amount for the selected date range
        const totalPurchaseAmount = availableItems.reduce((sum, item) => {
            return sum + (item.receivePrice * item.quantity);
        }, 0);

        // Prepare used items data
        const usedItemsData = usedItems.flatMap(item => item.usageHistory
            .filter(history => history.date >= start && history.date <= end)
            .map(history => ({
                name: item.name,
                quantityUsed: history.quantityUsed,
                usedBy: history.customer?.name || 'Unknown',
                reason: history.reason,
                date: history.date
            }))
        );

        // Send the response
        return res.status(200).json({
            totalUsedItems: usedItemsData.length,
            currentAvailableItems: availableItems.length,
            totalSaleAmount,
            totalPurchaseAmount,
            usedItems: usedItemsData,
            availableItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
