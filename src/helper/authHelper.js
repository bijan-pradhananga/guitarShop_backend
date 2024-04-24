const bcrypt = require('bcrypt')

const hashPassword = async(password) =>{
    try {
        const salt = 10;
        const hashedPass = await bcrypt.hash(password,salt)
        return hashedPass
    } catch (error) {
        console.log(error);
    }
}

const comparePass = async(password,hashedPassword) =>{
    return bcrypt.compare(password,hashedPassword)
}

module.exports = {hashPassword,comparePass}