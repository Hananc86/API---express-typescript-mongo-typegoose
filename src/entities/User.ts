import { prop, Typegoose } from 'typegoose'
class User extends Typegoose {
    @prop() name: string
}
export const UserModel = new User().getModelForClass(User);
