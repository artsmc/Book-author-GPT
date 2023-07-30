
import { ICompanies } from '../../interfaces/companies.interface';
import { IResponse } from '../../interfaces/response.interface';
import { UtilController } from '../util.controller';
import {  responseCreateController } from './response.create.controller';
import {  responseFindController } from './response.find.controller';

class ResponseController extends UtilController {
    constructor() {
        super();
    }
    create(body): Promise<IResponse> {
        return responseCreateController.create(body);
    }
    find(body): Promise<IResponse[]> {
        return responseFindController.findAll(body);
    }
}
export const responseController = new ResponseController();