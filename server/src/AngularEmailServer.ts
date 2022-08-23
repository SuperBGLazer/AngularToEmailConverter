import {Express, Request, Response} from "express";
import {json} from "body-parser";
import {default as fetch} from "node-fetch";
import * as cheerio from "cheerio";
const dropcss = require('dropcss');

const BASE_URL = "http://localhost:4000";

export class AngularEmailServer {
    private readonly app: Express;
    private static readonly dataMap = new Map<number, any>();
    private static currentId = 0;
    private static readonly port = 4000;

    constructor(app: Express) {
        this.app = app;

        app.listen(AngularEmailServer.port, () => {
            console.log(`Node Express server listening on http://localhost:${AngularEmailServer.port}`);
        });
    }

    startServer() {
        AngularEmailServer.setupRoutes(this.app);

        this.app.listen(AngularEmailServer.port, () => {
            console.log(`Node Express server listening on http://localhost:${AngularEmailServer.port}`);
        });
    }

    public static setupRoutes(app: Express) {
        app.use(json());
        app.post('/get-data', AngularEmailServer.getData);
        app.post('/create-email', AngularEmailServer.createEmail);
    }

    /**
     * Handle the get data request. This will return the data from the dataMap.
     *
     * Example request body:
     *
     * {
     *     "id": 25
     * }
     * @param req The request. The body must be in JSON format and contain the id.
     * @param res The response.
     * @private
     */
    private static getData(req: Request, res: Response) {
        try {
            // Get the id
            const id = req.body.id;

            // Check if the id exists in the data map
            if (AngularEmailServer.dataMap.has(id)) {

                // Get the data, delete it, and return it
                const data = AngularEmailServer.dataMap.get(id);
                AngularEmailServer.dataMap.delete(id);
                res.send(JSON.stringify(data));
                return;
            }

            res.send();
            return;
        } catch (e) {

            // Handle errors
            console.log(e);
            res.status(500);
            res.send();
        }
    }

    /**
     * Get the html for the email.
     *
     * Example request body:
     *
     * {
     *      "path": "/create-email",
     *      "data": {
     *          "emailAddress": "test@example.com"
     *      }
     * }
     * @param req The request body must be in JSON format and contain the email path and the data.
     * @param res The response.
     * @private
     */
    private static async createEmail(req: Request, res: Response) {
        try {
            // Get the data from the body
            const emailPath = req.body.emailPath;
            const data = req.body.data;

            // Check to see if the data is valid
            if (typeof(emailPath) == 'string' && data) {
                // Add the data to the data map and get the html from the server
                AngularEmailServer.dataMap.set(AngularEmailServer.currentId, data);
                const html = await fetch(`${BASE_URL}${emailPath}/${AngularEmailServer.currentId}`);
                AngularEmailServer.currentId++;

                // Return the html
                res.send(await AngularEmailServer.stripHtml(await html.text()));
                return;
            }

            res.send();
            return;
        } catch (e) {
            // Handle errors
            console.log(e);
            res.status(500);
            res.send();
            return;
        }
    }

    public static async stripHtml(html: string): Promise<string> {
        let $ = cheerio.load(html);
        const body = $('body');
        

        // Remove the script tags
        $('script').remove();

        // Get the CSS URLs
        const cssURLs: string[] = [];

        $('link').each((_, tag) => {
            if (tag.attribs.rel === 'stylesheet') {
                cssURLs.push(tag.attribs.href);
                $(tag).remove()
            }
        });

        // Download the CSS
        let css = '';
        for (const url of cssURLs) {
            let cssResponse;
            console.log(url);

            if (url.includes('https://') || url.includes('http://')) {
                console.log('url');
                cssResponse = await fetch(url);
            } else {
                cssResponse = await fetch(`${BASE_URL}/${url}`);
            }

            css += await cssResponse.text() + '\n';
        }

        // Move the style tags from the head to the body
        $('style').each((_, tag) => {
            if ($(tag).text()) {
                css += $(tag).text() + '\n';
                $(tag).remove();
            }
        })

        // Remove the head
        $('head').remove();

        // Remove the unneeded angular tags
        const appRoot = $('app-root');
        $('router-outlet').remove();
        body.append(appRoot.children().first().children());
        appRoot.remove();

        // Remove the unneeded css
        const usedCss = dropcss({css, html: body.html()}).css;

        body.append(`<style>${usedCss}</style>`)

        return body.html().trim().replace(/(\r\n|\n|\r)/gm, "");
    }
}