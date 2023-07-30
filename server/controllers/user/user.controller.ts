
import { IUsers } from '../../interfaces/user.interface';
import { UtilController } from '../util.controller';
import { userCreateController } from './user.create.controller';
import { usersFindController } from './user.find.controller';
import { userUpdateController } from './user.update.controller';

class UserController extends UtilController {
    constructor() {
        super();
    }
    create(body): Promise<IUsers> {
        return userCreateController.create(body);
    }
    update(body): Promise<IUsers> {
        console.log({body})
        return userUpdateController.update({...body, company: body.company._id, _id: body.decode.user._id});
    }
    find(body): Promise<IUsers[]> {
        return usersFindController.findAll(body);
    }
    findById(body): Promise<IUsers> {
        return usersFindController.findById(body);
    }
}
export const userController = new UserController();