const cron = require('node-cron');
const User = require('../../src/users/model/user.model');

changeToInvalid = async() => {
    try {
        const yesterday = new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() - 1)).toISOString()
        const now = new Date().toISOString()
        const data = await User.updateMany({ documentExpiryDate: { $gte: yesterday, $lte: now }, documentValidity: true }, { documentValidity: false })
    } catch (error) {
        console.log(error);
    }
}
const dailyReport = () => {
    cron.schedule('0 0 * * *', async() => {
        changeToInvalid();
    });
}



module.exports = dailyReport