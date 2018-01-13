import { Parser } from './parser';

export class Parsers {
    private parsers: Array<Parser>;
    private static instance;

    constructor() {
        this.parsers = new Array<Parser>();
    }

    public static getInstance(): Parsers {
        if (!Parsers.instance) {
            Parsers.instance = new Parsers();
        }
        return Parsers.instance;
    }

    public getParser(serialPort, timeout?): Parser { 
        console.log('serialPort', serialPort);
        serialPort = serialPort.replace(/\s/g, '');
        for (let index = 0; index < this.parsers.length; index++) {
            let parser = this.parsers[index];
            if (parser.getSerialPort() === serialPort) {
                if (timeout) {
                    parser.setTimeout(timeout);
                }
                return parser;
            }
        }
        let parser = new Parser(serialPort, timeout);
        this.parsers.push(parser);
        return parser;
    }

}
