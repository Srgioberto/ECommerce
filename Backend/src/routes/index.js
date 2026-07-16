const { Router } = require('express');

const { currentUser } = require('../middlewares/current-user');
const { userRouter } = require('./users');
const { productRouter } = require('./products');
const { cartRouter } = require('./carts');
const { adminRouter } = require('./admin');
const { orderRouter } = require('./orders');
const { profileRouter } = require('./profile');

const apiRouter = Router();
apiRouter.use(userRouter);

apiRouter.use(currentUser);
apiRouter.use(cartRouter);
apiRouter.use(productRouter);
apiRouter.use(orderRouter);
apiRouter.use(adminRouter);
apiRouter.use(profileRouter);

module.exports = { apiRouter };
