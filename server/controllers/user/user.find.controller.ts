import { IUsers } from "../../interfaces/user.interface";
import { UserModel } from "../../models/user.model";
import { UtilController } from "../util.controller";



export class UsersFindController extends UtilController{
    constructor() {
        super();
    }
    findById(body): Promise<IUsers> {
        return new Promise(async (resolve, reject) => {
            UserModel.findOne({ _id: body.user._id }).then((user) => {
               resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    findAll(body): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            const options = {
                page: 1,
                limit: 10,
                collation: {
                    locale: 'en',
                },
            };
            console.log(this.extendDefaults({ user: body.decode.user._id }, body.query));
            // @ts-ignore
            UserModel.paginate(this.extendDefaults({ user: body.decode.user._id }, body.query), this.extendDefaults(options, body.options), (err: any, value) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }
    extendDefaults(source, properties) {
        let property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

}
export const usersFindController = new UsersFindController();