import { IUsers } from "../../interfaces/user.interface";
import { UserModel } from "../../models/user.model";
import { UtilController } from "../util.controller";



export class UserUpdateController extends UtilController {
    constructor() {
        super();
    }
    update(body): Promise<IUsers> {
        console.log({update:body})
        return new Promise(async (resolve, reject) => {
            UserModel.findOneAndUpdate({ _id: body._id }, body, { new: true }).then((user) => {
                resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
export const userUpdateController = new UserUpdateController();