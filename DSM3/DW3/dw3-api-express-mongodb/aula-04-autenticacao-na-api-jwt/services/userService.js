// Importando model
import User from "../models/Users.js";

class userService{

    async create(email, password){

        try{

            const newUser = new User({
                email,
                password
            })
            await newUser.save()

        }catch(error){
            console.log(error)
        }
        

    }

    async getOne(email){

        try{

            const user = await User.findOne({email: email})
            return user

        }catch(error){
            console.log(error)
        }

    }

}

export default new userService()