import * as fs from "fs";
import {AngularEmailServer} from "./AngularEmailServer";

const htmlContent = fs.readFileSync('tests/test.html').toString();
// console.log(htmlContent)
const strippedHtml = AngularEmailServer.stripHtml(htmlContent);
console.log(strippedHtml);