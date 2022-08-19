import * as fs from "fs";
import {AngularEmailServer} from "../src/AngularEmailServer";

describe('AngularEmailsServer', () => {
    it('should strip the html', async () => {
        const htmlContent = fs.readFileSync('tests/test.html').toString();
        console.log(htmlContent);
        const strippedHtml = AngularEmailServer.stripHtml(htmlContent);
        console.log(strippedHtml);
    })
});