import * as Tokgen from 'tokgen';

export class UtilService {
    constructor() {}

    public extendDefaults(source: Record<string, any>, properties: Record<string, any>): Record<string, unknown>{
        return { ...source, ...properties };
    }

    public token(size = 12): string {
        const generator = new Tokgen({ chars: '0-9a-f', length: size });
        return generator.generate();
    }

    public splitFlatText(splitAt: number, value: string) {
        const regex = new RegExp(`.{1,${splitAt}}\\S(?= |$)`, 'g');
        const splitString: string[] = value.match(regex) || [' '];
        const splitStringMap = splitString.map(text => ({ text }));
        return { count: splitString.length, splitStringMap };
    }
}

export const utilService = new UtilService();