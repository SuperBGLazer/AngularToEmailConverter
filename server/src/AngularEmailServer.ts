import {Express, Request, Response} from "express";
import * as bodyParser from "body-parser";

export abstract class AngularEmailServer {
    private app: Express;
    private readonly dataMap = new Map<number, any>();
    private currentId = 0;

    protected constructor(app: Express) {
        this.app = app;
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.use(bodyParser);
        this.app.post('/get-data', (req, res) => this.getData(req, res));
        this.app.post('/create-email', (req, res) => this.createEmail(req, res));
    }

    /**
     * Handle the get data request. This will return the data from the dataMap.
     * @param req The request. The body must be in JSON format and contain the id.
     * @param res The response.
     * @private
     */
    private getData(req: Request, res: Response) {
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

    private async createEmail(req: Request, res: Response) {
        try {
            const emailPath = req.body.emailPath;
            const data = req.body.data;

            if (typeof(emailPath) == 'string' && data) {
                this.dataMap.set(this.currentId, data);
                const html = await fetch(`http://localhost:4000${emailPath}/${this.currentId}`);
                this.currentId++;
                res.send(await html.text())
            }

            res.send();
            return;
        } catch (e) {
            // Handle errors
            console.log(e);
            res.status(500);
            res.send();
        }
        res.send();
    }

    abstract startServer();
}