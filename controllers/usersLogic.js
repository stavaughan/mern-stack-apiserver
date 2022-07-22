import bcrypt from 'bcryptjs'
import { tokenHandler } from '../utils/tokenHandler.js'
import messages from '../utils/messages.js'
import userEmailLogic from './userEmailLogic.js'
import userContactLogic from './userContactLogic.js'
import passwordLogic from '../utils/passwordLogic.js'
import userPermissions from '../config/userPermissions.js'
import { sendResetEmail, sendActivationEmail } from './mailer.js'

const msgs = messages.controllers.users;

const { 
    updatedUserByPassword, 
    updateUserPassword, 
    userContact, 
    createUser, 
    getUserName, 
    missingParam,
    addApprovedEmail
} = userContactLogic;

const { 
    userByEmailcheck, 
    approvedEmail, 
    newUserEmailCheck, 
    approvedUserByEmail,
    newAccountEmailCheck
} = userEmailLogic;

const { 
    generateToken, 
    getHashedPassword 
} = tokenHandler;

const { 
    temporaryPassword 
} = passwordLogic;

const usersLogic = {

    handleUserLogin: async (req, res) => {

        const { password, email } = req.body;
        const user = await userByEmailcheck(res, email, 'invalidLogin')
        missingParam(res, [user?.verified], 'notVerified')
        const pwCompare = await bcrypt.compare(password, user?.password);

        try {
            if (pwCompare && user?.verified) {
                const userObj = {
                    _id: user._id,
                    verified: user.verified,
                    email: user.email,
                    contactID: user.contactID,
                    access: user.access,
                    token: generateToken(user._id)
                }
                res.json(userObj)
            } else {
                res.status(401)
                throw new Error(msgs.invalidLogin)
            }
        } catch (error) {
            res.status(401)
            throw new Error(error)
        }
    },

    handleUserActivation: async (req, res) => {

        const { email, password, suppliedPassword } = req.body;

        missingParam(res, [email, password, suppliedPassword], 'missingEM_NPW_PPW')

        const user = await userByEmailcheck(res, email, 'noMatchEmail')
        const pwCompare = await bcrypt.compare(suppliedPassword, user?.password);
        const userID = await user?._id || '';

        missingParam(res, [pwCompare, userID], 'tempPWnoMatch')

        try {
            const hashedPassword = await getHashedPassword(password)
            const updatedUser = await updatedUserByPassword(res, userID, hashedPassword);
            res.json(updatedUser)
        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    },

    handleForgotPassword: async (req, res) => {

        const { email } = req.body

        try {
            const user = await userByEmailcheck(res, email, 'noMatchEmail')
            const token = await generateToken(user._id)
            sendResetEmail({ user, token })
            res.json({ email: user.email })
        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    },

    handleVerifyEmail: async (req, res) => {

        const { email } = req.body

        missingParam(res, [email], 'missingEM')

        // Check to see if email is on the admin appoved list
        // check if email is associated with existing user
        const user = await approvedUserByEmail(res, email)
        const userID = user?._id;
        const token = await generateToken(userID);
        const userName = await getUserName(res, email);

        // generate temporary password for user
        const { password, hashedPassword } = await temporaryPassword()

        // updateUser with new temporary password
        const updatedUser = await updateUserPassword(res, userID, hashedPassword)

        try {
            sendActivationEmail({ email, userName, password, token })
            res.json({ ...updatedUser, token })
        } catch (error) {
            res.status(401)
            throw new Error(error)
        }
    },

    handleGrantAccess: async (req, res) => {

        const { email, firstName, lastName, userRole } = req.body

        missingParam(res, [email], 'missingEM')
        missingParam(res, [firstName, lastName], 'missingFN_LN')

        // Check to see if email is on the admin appoved list
        const approved = await addApprovedEmail(res, email)

        // check if email is associated with existing user
        const newUserEmail = await newUserEmailCheck(res, approved)

        // Create or update contact with userRole
        const { contactID, fullName } = await userContact({
            res,
            firstName,
            lastName,
            email: newUserEmail,
            userRole
        })

        // generate temporary password for user
        const { password, hashedPassword } = await temporaryPassword()

        const access = userPermissions.find(_ => _.role === userRole).access;

        // Create user account
        const user = await createUser({
            res,
            email: newUserEmail,
            contactID,
            password: hashedPassword,
            access
        });

        const userID = await user?._id;
        const token = await generateToken(userID);

        try {
            sendActivationEmail({
                email,
                userName: fullName,
                password,
                token
            })
            res.json({ ...user, token })
        } catch (error) {
            res.status(401)
            throw new Error(error)
        }
    },

    handleRequestAccess: async (req, res) => {

        const { email, firstName, lastName, userRole } = req.body

        missingParam(res, [email], 'missingEM')
        missingParam(res, [firstName, lastName], 'missingFN_LN')

        // Check to see if email is on the admin appoved list
        const adminApprovedEmail = await approvedEmail(res, email)

        // check if email is associated with existing user
        const newUserEmail = await newUserEmailCheck(res, adminApprovedEmail)

        // Create or update contact with userRole
        const { contactID, fullName } = await userContact({
            res,
            firstName,
            lastName,
            email: newUserEmail,
            userRole
        })

        // generate temporary password for user
        const { password, hashedPassword } = await temporaryPassword()

        const access = userPermissions.find(_ => _.role === userRole).access;

        // Create user account
        const user = await createUser({
            res,
            email: newUserEmail,
            contactID,
            password: hashedPassword,
            access
        });

        const userID = await user?._id;
        const token = await generateToken(userID);

        try {
            sendActivationEmail({
                email,
                userName: fullName,
                password,
                token
            })
            res.json({ ...user, token })
        } catch (error) {
            res.status(401)
            throw new Error(error)
        }
    },

    handleNewAccountSetup: async (req, res) => {

        const { email, firstName, lastName } = req.body

        missingParam(res, [email], 'missingEM')
        missingParam(res, [firstName, lastName], 'missingFN_LN')

        // Check to see if users already exist
        const validEmail = await newAccountEmailCheck(res, email)

        // Create user contact file
        const { contactID, fullName } = await userContact({
            res,
            firstName,
            lastName,
            email: validEmail,
            userRole: 'admin'
        })

        // generate temporary password for user
        const { password, hashedPassword } = await temporaryPassword()

        // Create user account
        const user = await createUser({
            res,
            email: validEmail,
            contactID,
            password: hashedPassword,
            access: 'admin'
        });

        const userID = await user?._id;
        const token = await generateToken(userID);

        try {
            sendActivationEmail({
                email,
                userName: fullName,
                password,
                token
            })
            res.json({ ...user, token })
        } catch (error) {
            res.status(401)
            throw new Error(error)
        }
    },

    handleResetPassword: async (req, res) => {

        const { email, password } = req.body

        missingParam(res, [email, password], 'provideEmailnPW')

        const user = await userByEmailcheck(res, email, 'noMatchEmail')
        const userID = await user?._id;
        const pwCompare = await bcrypt.compare(password, user.password);

        if (pwCompare) {
            res.status(401)
            throw new Error(msgs.provideDifferentPW)
        }

        try {
            const hashedPassword = await getHashedPassword(password)
            const updated = await updatedUserByPassword(res, userID, hashedPassword)
            res.status(200).json(updated)

        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    }
}

export default usersLogic