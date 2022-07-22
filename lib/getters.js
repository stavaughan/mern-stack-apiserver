/**
 *
 * @param {(string | number)} num num with or without dashes
 * @returns {string} `XXXX`
 */
const getLast4 = (num) => {
    const numStr = num.toString();
    return numStr.slice(numStr.length - 4, numStr.length);
};

const getters = {

    expirationDate: (days) => {
        const dateNow = new Date();
        const totalDays = dateNow.getDate() + days;
        return new Date(totalDays)
    },

    toLower: (val) => val.toLowerCase(),

    /**
     *
     * @param {(string | number)} cc - credit card number with or without dashes
     * @returns {string} `****-****-****-XXXX`
     */
    obfuscateCC: (cc) => {
        const last4 = getLast4(cc);
        return `****-****-****-${last4}`;
    },

    getName: (str, num) => {

        const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");

        return str
            .replaceAll(' ', '')
            .replaceAll('-', '')
            .split('')
            .filter((_, i) => i < num)
            .reduce((a, b) => a + b, '') + '_' + randomHex;
    }
}

export default getters
