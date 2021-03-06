import express from 'express';
import authRouter from './authRouter';
import resetRouter from './password.reset';
import articleRouter from './articleRouter';
import profileRouter from './profileRouter';
import authorsRouter from './authorsRoutes';
import adminRouter from './adminRouter';
import bookmarkRouter from './bookmarkRouter';
import notificationRouter from './notificationRouter';

import termsAndConditionsRouter from './termsAndConditions';
import reactionsRouter from './commentReactionsRoute';

import categoryRouter from './categoryRoute';
import tagRouter from './TagsRouter';

const router = express();
router.use('/password-reset', resetRouter);
router.use('/articles', articleRouter);
router.use('/users', authRouter);
router.use('/authors', authorsRouter);
router.use('/profiles', profileRouter);
router.use('/admin', adminRouter);
router.use('/bookmarks', bookmarkRouter);
router.use('/notifications', notificationRouter);

router.use('/termsAndConditions', termsAndConditionsRouter);
router.use('/comment', reactionsRouter);

router.use('/categories', categoryRouter);

router.use('/tags', tagRouter);

export default router;
