import nodemailer from 'nodemailer'
import { emailHTML } from '../utils/emailHTML.js'


const resetLink = (path, token) => `${process.env.DOMAIN}/${path}?rid=${token}`;

const emailResetVerification = (token) => emailHTML({
    title: 'Password Reset',
    content1: `You're getting this message because we reset your account password.\nYou will need to create a new password before you can login.\nIf you did not request a password reset, please ignore this email.`,
    label: 'Login',
    link: resetLink('reset', token),
    content2: `If you have any questions, please contact us at ${process.env.EMAIL}.`
});

const emailNewSignupVerification = ({ userName, password, token }) => emailHTML({
    title: `Welcome ${userName}`,
    content1: `A new user account has been created for you along with a temporary password.\nYour temporary password is <b>${password}</b>\nIf you lose this password, click 'forgot password' at login and follow the instructions.\nYou must activate your account before you can access it. In order to activate your account, click the link below and login with your email and your temporary password.\nUpon login you will be re-directed to change your password to a password of your choice. Please make sure your new password is at least 8 characters long, using both upper and lower case letters and at least (1) numerical character.`,
    label: 'Activate Account',
    link: resetLink('activate', token)
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD
    }
})

export const sendActivationEmail = async (user) => {

    const message = {
        from: process.env.GOOGLE_USER,
        to: user.email,
        subject: 'Activate your account',
        html: emailNewSignupVerification(user)
    }

    await transporter.sendMail(message)
}

export const sendResetEmail = async ({ user, token }) => {

    const message = {
        from: process.env.GOOGLE_USER,
        to: user.email,
        subject: 'Reset your account password',
        html: emailResetVerification(token)
    }

    await transporter.sendMail(message)
}
