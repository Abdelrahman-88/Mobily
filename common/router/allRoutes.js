const userRouter = require('../../src/users/routes/user.routes');
const documentRouter = require('../../src/documents/routes/document.routes');
const adminRouter = require('../../src/admins/routes/admin.routes');
const serviceRouter = require('../../src/services/routes/service.routes');
const orderRouter = require('../../src/orders/routes/order.routes');
const cartRouter = require('../../src/cart/routes/cart.routes');
const followUPRouter = require('../../src/followUp/routes/followUp.routes');
const priceOfferRouter = require('../../src/priceOffer/routes/priceOffer.routes')


module.exports = {
    userRouter,
    documentRouter,
    adminRouter,
    serviceRouter,
    orderRouter,
    cartRouter,
    followUPRouter,
    priceOfferRouter
}