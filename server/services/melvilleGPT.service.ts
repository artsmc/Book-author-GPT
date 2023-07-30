import { UtilService } from "./util.service";

class MelvilleGPTService extends UtilService {
    constructor() {
        super();
    }

    async query(memory, query): Promise<any> {
      return {};
    }
}

export const melvilleGPTService = new MelvilleGPTService();