import {Express, Request, Response} from "express";
import {json} from "body-parser";
import {default as fetch} from "node-fetch";
import {JSDOM} from "jsdom";
import {NS} from "parse5/dist/common/html";

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
            if (this.dataMap.has(id)) {

                // Get the data, delete it, and return it
                const data = this.dataMap.get(id);
                this.dataMap.delete(id);
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
        // Convert the html to a JSDOM Document
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Remove the script tags
        document.head.querySelectorAll('script').forEach((element) => element.remove());
        document.body.querySelectorAll('script').forEach((element) => element.remove());

        // Get the CSS
        const cssURLs = [];
        const links = document.head.querySelectorAll('link');
        links.forEach((link) => {
            if (link.rel === 'stylesheet') {
                if (link.href) {
                    cssURLs.push(link.href);
                }
            }
        })

        // Download the CSS
        for (const url of cssURLs) {
            const cssResponse = await fetch(`${BASE_URL}/${url}`);
            document.createElement('script').innerText = await cssResponse.text();
        }

        // Remove the head
        document.head.remove();

        return dom.serialize();
    }
}