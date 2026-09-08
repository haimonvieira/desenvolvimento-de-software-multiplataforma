// userService.js:

// Importando o Model
import User from "../models/Users.js"
class userService {
    // MÉTODO PARA CADASTRAR UM USUÁRIO
    async Create(email, password) {
        try {
            const newUser = new User({
                // email: email,
                // password: password
                email,
                password
            });
            await newUser.save();
        } catch (error) {
            console.log(error);
        }
    }
    // MÉTODO PARA LISTAR UM USUÁRIO
    async getOne(email) {
        try {
            const user = await User.findOne({ email: email });
            return user;
        } catch (error) {
            console.log(error);
        }
    }
}
export default new userService()