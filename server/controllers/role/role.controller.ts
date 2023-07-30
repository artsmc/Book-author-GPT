
import { IRoles } from '../../interfaces/roles.interface';
import { IUsers } from '../../interfaces/user.interface';
import { UtilController } from '../util.controller';
import { roleCreateController } from './role.create.controller';
import { rolesFindController } from './role.find.controller';

class RoleController extends UtilController {
    constructor() {
        super();
    }
    create(body): Promise<IRoles> {
        return roleCreateController.create(body);
    }
    findOrCreate(body): Promise<IRoles> {
        return roleCreateController.findOrCreate(body);
    }
    find(body): Promise<IUsers[]> {
        return rolesFindController.findAll(body);
    }
}
export const roleController = new RoleController();