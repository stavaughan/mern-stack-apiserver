import htmlTemplate from './htmlTemplate.js';

const { messageWrapper } = htmlTemplate

const messages = {

    noAccess: () => messageWrapper('Access Denied! No authorized access without proper credentials.'),

    serverError: () => messageWrapper('Crap! Internal Server Error.'),

    notFound: () => messageWrapper('Page Not Found! The page you are looking for does not exist.'),

    notFoundJSON: 'the JSON file you\'re looking for cannot be located.',

    notFoundText: 'the Text file you\'re looking for cannot be located.',

    root:  () => messageWrapper('Please set to production.'),

    forbidden: () => messageWrapper('403 Forbidden'),

    controllers: {
        users: {
            invalidLogin: 'The login credentials provided are invalid.',
            noActiveAccount: 'The credentials provided do not belong to an active user account.',
            provideDifferentPW: 'You must provide a different password than your existing one.',
            provideEmailnFName: 'Please provide email and first name',
            noMatchEmail: `The email provided doesn't match an existing user!`,
            missingEM: 'Email not associated with a user.',
            provideEmailnPW: 'You must provide both an email and a password.',
            missingEM_FN_PW: 'Please provide your first name, email and password.',
            missingFN_LN: 'Please provide your first and last name.',
            missingEM_NPW_PPW: 'Please provide email, new password and the password you received in your email.',
            userExists: 'User already exists.',
            notVerified: `You haven't verified your account via the link we emailed you. Please activate your account by clicking 'request access' at the bottom of the Login section.`,
            userInvalid: 'User cannot be validated with information provided.',
            invalidActivation: 'The activation credentials provided are invalid.',
            alreadyVerified: `You are already a verified user. Please click 'forgot password' at login, to change your password.`,
            notApprovedEmail: 'Access denied! The email entered is not on the approved list. Please contact application administrator to have your email placed on the list.',
            tempPWnoMatch: 'The temporary password you entered does not with the one sent to you!',
            badServerNoUser: `Problem with server, user couldn't be created at this time`
        },
        collections: {
            getItem: (id) => `Failed to fetch item!\nThe requested item, with id number ${id}, cannot be found.`,
            noContent: 'No Content...',
            getItems: 'Failed to upload collection items.',
            newItem: `Failed to add a new item!\nPlease add the required data for your item to be added.`,
            newItems: `Failed to add items!\nPlease add data or the required and properly structured data for the items you wish to add.`,
            updateItem: (id) => `Failed to update!\nThe requested item with the id number of ${id}, was not found.`,
            deleteItem: (id) => `Failed to delete!\nThe requested item with the id number of ${id}, was not found.`,
            deleteItems: (ids) => `The items with the following id numbers were not found: ${ids}.`
        }
    }
}

export default messages;
