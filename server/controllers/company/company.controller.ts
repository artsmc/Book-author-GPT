
import { ICompanies } from '../../interfaces/companies.interface';
import { UtilController } from '../util.controller';
import { companyCreateController } from './company.create.controller';
import { companyFindController } from './company.find.controller';

class ComapnyController extends UtilController {
    constructor() {
        super();
    }
    create(body): Promise<ICompanies> {
        return companyCreateController.create(body);
    }
    find(body): Promise<ICompanies[]> {
        return companyFindController.findAll(body);
    }
    findByName(body): Promise<ICompanies> {
        return companyFindController.findByName(body);
    }
}
export const companyController = new ComapnyController();