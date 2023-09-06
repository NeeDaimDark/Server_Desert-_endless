import express from 'express';

import { register, deleteOnce, getAll, getOnce, patchOnce, login, profile, sendMail, sendRegistrationMail, forgetPassword, changePassword, changePasswordInProfile, resetPass, getAllusr,getUserbyUserId,updateUserbyuserId} from '../controllers/user.js';
//import sendRegistrationMail from '../controllers/user.js'
import { checkToken } from '../middlewares/auth.js';

const router = express.Router();

// create account
router
    .route('/register')
    .post(register);
// router
// .route('/code')
// .post(code);

// router
// .route('/wallet')
// .post(connectToWallet);

// login
router
    .route('/getOnce/:id')
    .get(getOnce)
router
    .route('/login')
    .post(login);




/*router
.post("/forgetPassword", forgetPassword);
*/
router
    .route('/reset' ).post(resetPass);


router.post("/changePassword", changePassword);

router.post("/changePasswordProfile/:id", changePasswordInProfile);

router
    .route('/mail')
    .post(sendMail);


router
    .route('/')
    .get(getAll);

router.route('/usrs').get(getAllusr);

/**
 * router
 .route('/')
 .get(checkToken, getAll)
 .post(register);





 router
 .route('/register')
 .post(sendRegistrationMail);
 */
router
    .route('/:id')
    .patch(checkToken, patchOnce)
    .delete( deleteOnce);
//router.get("/profile", checkToken, profile)
router.post("/login", login);






// Get user
router.route('/getUserbyUserId/:UserId').get(getUserbyUserId);

// Update user
router.route('/updateUserbyuserId/:UserId').put(updateUserbyuserId);




export default router;