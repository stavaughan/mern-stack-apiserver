import User from '../models/app/userModel.js'
import EmailList from '../models/app/emailListModel.js'
import messages from '../utils/messages.js'

const msgs = messages.controllers.users;

const userEmailLogic = {

    // Only want to see if email is connected to existing account
    userByEmail: async (email) => {

        const existingUser = await User.findOne({ email: email.toLowerCase() })
        const user = await existingUser;
        return  user;
    },

    userByEmailcheck: async (res, email, msg) => {

        const user = await userEmailLogic.userByEmail(email)

        if (user && user?.email) {
            return user
        } else {
            res.status(401)
            throw new Error(msgs[msg])
        }
    },

    // For new account, need to verify that user collection is empty or send error
    newAccountEmailCheck: async (res, email) => {

        const users = await User.find();

        if (users?.length) {
            const user = await userEmailLogic.userByEmail(email)
            if(user) {
                const message = `You're already a verified user. Try to login or click 'forgot password'`
                res.status(401)
                throw new Error(message)
            } else {
                const message = 'Access not authorized. '
                res.status(403)
                throw new Error(message)
            }
        } else {
            return email
        }
    },

    newUserEmailCheck: async (res, email) => {

        const user = await userEmailLogic.userByEmail(email)

        if (!user) {
            return email
        } else {
            const message = user?.verified ? msgs.alreadyVerified : msgs.userExists
            res.status(401)
            throw new Error(message)
        }
    },

    // checks to see if entered email is on the approved email list
    approvedEmail: async (res, email) => {

        const approved = await EmailList.findOne({
            email: email.toLowerCase(),
            approved: true
        })

        const approvedUser = await approved;

        if (approvedUser && approvedUser?.email) {
            return approvedUser?.email
        } else {
            res.status(401)
            throw new Error(msgs.notApprovedEmail)
        }
    },

    // checks to see if entered email is on the approved email list and that the user is a listed user
    approvedUserByEmail: async (res, email) => {
        const approvedEmail = await userEmailLogic.approvedEmail(res, email);
        const approvedUser = await userEmailLogic.userByEmailcheck(res, approvedEmail, 'noMatchEmail');
        return approvedUser
    }
}

export default userEmailLogic
