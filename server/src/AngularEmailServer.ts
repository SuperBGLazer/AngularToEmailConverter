import {Express} from "express";

export abstract class AngularEmailServer {
    protected constructor(app: Express) {
    }

    abstract startServer();
}