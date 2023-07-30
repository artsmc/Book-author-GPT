import { ICompanies } from "../../interfaces/companies.interface";
import { IResponse } from "../../interfaces/response.interface";
import { CompanyModel } from "../../models/companies.model";
import { ResponseModel } from "../../models/response.model";
import { openAIService } from "../../services/openai.service";
import { UtilController } from "../util.controller";



export class ResponseCreateController extends UtilController {
    constructor() {
        super();
    }
    create(body): Promise<IResponse> {
        return new Promise(async (resolve, reject) => {
            const newDoc = new ResponseModel({
                ...body,
                ...{user: body.decode.user._id}
            });
            newDoc.save().then((doc) => {
                openAIService.BuildCustomCustomerResponse({
                    ...body
                },{model:'gpt-3.5-turbo-16k'}).then((response) => {
                    doc.responseCreated = response;
                    doc.save().then((response) => {
                        resolve(response);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
export const responseCreateController = new ResponseCreateController();