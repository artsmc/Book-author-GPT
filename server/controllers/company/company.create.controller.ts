import { ICompanies } from "../../interfaces/companies.interface";
import { CompanyModel } from "../../models/companies.model";
import { UtilController } from "../util.controller";



export class CompanyCreateController extends UtilController {
    constructor() {
        super();
    }
    findOrCreate(body): Promise<ICompanies> {
        return new Promise(async (resolve, reject) => {
            CompanyModel.findOne({ name: body.name }).then((company) => {
                if (company && company._id) {
                    resolve(company);
                } else {
                    const newDoc = new CompanyModel({
                        ...body
                    });
                    newDoc.save().then((company) => {
                        resolve(newDoc);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
    create(body): Promise<ICompanies> {
        return new Promise(async (resolve, reject) => {
            const newDoc = new CompanyModel({
                ...body
            });
            newDoc.save().then((user) => {
                resolve(newDoc);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
export const companyCreateController = new CompanyCreateController();