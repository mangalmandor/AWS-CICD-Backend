import cron from 'node-cron';
import Product from '../models/Product.js'; 

const initItemsCleanup = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log("Running daily cleanup...");
            const expiryDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            await Product.deleteMany({ updatedAt: { $lt: expiryDate } });
            console.log("Cleanup successful");
        } catch (error) {
            console.error("Cron Job Failed:", error);
        }
    });
};

export default initItemsCleanup;
