const router = require("express").Router();
const validation = require("../../../common/middelWare/validation");
const { logIn, logOut } = require("../controler/login");
const {
    register,
    verifyEmail,
    resendVerificationKey
} = require("../controler/register");
const {
    updateProfile,
    updatePassword,
    sendResetKey,
    resetPassword,
    changePassword
} = require("../controler/update");
const {
    registerSchema,
    verifyEmailSchema,
    resendVerificationKeySchema,
    logInSchema,
    updateProfileSchema,
    updatePasswordSchema,
    resetKeySchema,
    resetPasswordSchema,
    changePasswordSchema,
    logOutSchema,
    userExpireDocmentSchema,
    getAllUsersSchema,
    displayProfilePicSchema
} = require("../validation/user.validation");
const isAuthorized = require("../../../common/middelWare/isAuthorized");
const {
    UPDATE_PROFILE,
    UPDATE_PASSWORD,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    LOG_OUT,
    USER_EXPIRE_DOCMENT,
    GET_ALL_USERS
} = require("../endPoint");
const { userExpireDocment } = require("../controler/expire");
const {
    getAllUsers,
    displayProfilePic
} = require("../controler/get");
const uploadPic = require("../../../common/service/uploadPic");

router.post("/register", validation(registerSchema), register);

router.patch("/verifyEmail/:id", validation(verifyEmailSchema), verifyEmail);

router.get("/resendVerificationKey/:id", validation(resendVerificationKeySchema), resendVerificationKey);

router.post("/logIn", validation(logInSchema), logIn);

router.patch("/updateProfile/:id", uploadPic.single('profilePic'), validation(updateProfileSchema), isAuthorized(UPDATE_PROFILE), updateProfile);

router.patch("/updatePassword/:id", validation(updatePasswordSchema), isAuthorized(UPDATE_PASSWORD), updatePassword);

router.post("/sendResetKey", validation(resetKeySchema), sendResetKey);

router.patch("/resetPassword", validation(resetPasswordSchema), isAuthorized(RESET_PASSWORD), resetPassword);

router.patch("/changePassword/:id", validation(changePasswordSchema), isAuthorized(CHANGE_PASSWORD), changePassword);

router.patch("/logOut/:id", validation(logOutSchema), isAuthorized(LOG_OUT), logOut);

router.patch("/userExpireDocment", validation(userExpireDocmentSchema), isAuthorized(USER_EXPIRE_DOCMENT), userExpireDocment);

router.get("/getAllUsers", validation(getAllUsersSchema), isAuthorized(GET_ALL_USERS), getAllUsers);

router.get("/displayProfilePic/:filename", validation(displayProfilePicSchema), displayProfilePic);






module.exports = router;