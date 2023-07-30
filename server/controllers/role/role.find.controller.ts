import { UtilController } from "../util.controller";



export class RolesFindController extends UtilController{
    constructor() {
        super();
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
            RoleModel.paginate(this.extendDefaults({ user: body.decode.user._id }, body.query), this.extendDefaults(options, body.options), (err: any, value) => {
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
export const rolesFindController = new RolesFindController();