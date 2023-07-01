export default class ServerInfo {
    _server;
    constructor() {}

    static set setServer(server) {
        this._server = server;
    }

    static get getServer() {
        return this._server;
    }
}