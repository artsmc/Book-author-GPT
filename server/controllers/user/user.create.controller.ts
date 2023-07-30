import { IUsers } from "../../interfaces/user.interface";
import { RoleModel } from "../../models/roles.model";
import { UserModel } from "../../models/user.model";
import { roleController } from "../role/role.controller";
import { UtilController } from "../util.controller";



export class UserCreateController extends UtilController {
    constructor() {
        super();
    }
    findOrCreate(body): Promise<IUsers> {
        return new Promise(async (resolve, reject) => {
            roleController.findOrCreate({ name: 'agent' }).then((role) => {
                UserModel.findOne({ email: body.email }).then((user) => {
                const resolveUser = user? user.toObject() : null;
                if (resolveUser && resolveUser._id) {
                    resolve(user);
                } else {
                    const newDoc = new UserModel({
                        ...body,
                        role: role._id,
                        token: this.token(7),
                    });
                    newDoc.save().then((user) => {
                        resolve(newDoc);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                }).catch((err) => {
                    reject(err);    
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    create(body): Promise<IUsers> {
        return new Promise(async (resolve, reject) => {
            roleController.findOrCreate({ name: 'agent' }).then((role) => {
                const newDoc = new UserModel({
                    ...body,
                    role: role._id,
                    token: this.token(7),
                });
                newDoc.save().then((user) => {
                    resolve(newDoc);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
export const userCreateController = new UserCreateController();