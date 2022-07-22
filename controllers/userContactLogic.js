import Contact from '../models/app/contactModel.js'
import User from '../models/app/userModel.js'
import EmailList from '../models/app/emailListModel.js'
import messages from '../utils/messages.js'
import { tokenHandler } from '../utils/tokenHandler.js'

const { generateToken } = tokenHandler;

const msgs = messages.controllers.users;

const userContactLogic = {

    addApprovedEmail: async (res, email) => {
        try {
            const newEmail = await EmailList.create({ email, approved: true })
            const approvedEmail = await newEmail;
            return approvedEmail?.approved
        } catch (error) {
            res.status(401)
            throw new Error(error)
        }
    },

    missingParam: (res, params, message) => {
        const boolParams = params.map(p => Boolean(p));
        if(!boolParams.includes(true)){
            res.status(401)
            throw new Error(msgs[message])
        }
    },

    getUserName: async (res, email) => {
        try {
            const contact = await Contact.findOne({ email: email.toLowerCase() })
            const userContact = await contact;
            const userName = userContact?.name?.fullName;
            return userName
        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    },

    userContact: async (params) => {

        const {
            email,
            firstName = '',
            lastName = '',
            userRole
        } = params;

        const fullName = firstName ? `${firstName} ${lastName}` : '';

        const name = {
            given_name: firstName,
            surname: lastName,
            fullName
        };

        try {

            // Check to see if contact exists by email
            const existing = await Contact.findOne({ email: email.toLowerCase() })

            const existingUser = await existing;

            // If contact exists get contactID
            const existingID = existingUser && existingUser?._id ? existingUser._id : null;

            // If contact exists add 'userRole' field, else create a new contact
            const contact = existingID
                ? await Contact.findByIdAndUpdate(existingID, { userRole }, { new: true })
                : await Contact.create({
                    name,
                    fullName,
                    email,
                    userRole
                })

            const contactID = await contact._id;
            const fullName = await contact.name.fullName;

            return { contactID, fullName }

        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    },

    updateUserPassword: async (res, userID, hashedPassword) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(userID, {
                password: hashedPassword,
                verified: true,
            }, { new: true })
            const user = await updatedUser;
            return user
        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    },

    updatedUserByPassword: async (res, userID, hashedPassword) => {

        const updatedUser = await userContactLogic.updateUserPassword(res, userID, hashedPassword);

        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            contactID: updatedUser.contactID,
            access: updatedUser.access,
            password: updatedUser.password,
            token: await generateToken(updatedUser._id)
        }
    },

    createUser: async ({ res, email, contactID, password, access }) => {
        try {
            const user = await User.create({
                email,
                contactID,
                password,
                access
            });
            const newUser = await user;
            return newUser
        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    },

    updatedUser: async (params) => {

        const {
            res,
            email,
            firstName,
            lastName,
            userRole,
            userID,
            hashedPassword
        } = params;

        // create or update contact associated with new user and return id
        const { contactID, fullName } = await userContactLogic.userContact({
            res,
            email,
            firstName,
            lastName,
            userRole
        })

        const updatedUser = userID
            ? await userContactLogic.updateUserPassword(res, userID, hashedPassword)
            : await userContactLogic.createUser({
                res,
                email,
                contactID,
                hashedPassword,
                userName: firstName ? `${firstName} ${lastName}` : ''
            });

        const user = await updatedUser;

        if (user && user?._id) {
            return { user, fullName }
        } else {
            res.status(400)
            throw new Error(msgs.badServerNoUser)
        }
    },

    accessUser: async (params) => {

        const {
            res,
            email,
            hashedPassword,
            firstName = '',
            lastName = '',
            userRole
        } = params;

        try {

            const { user, userName } = await userContactLogic.updatedUser({
                res,
                email,
                firstName,
                lastName,
                userRole,
                userID: existingUser?._id,
                hashedPassword
            });

            return { user, userName }

        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    }
}

export default userContactLogic
