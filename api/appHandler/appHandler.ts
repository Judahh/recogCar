import { Router, Request, Response, NextFunction, Electron, ApiConfiguration, express, path, BasicApi, BasicAppHandler, BasicSocket } from 'backapijh';
import { HardwareHandler } from '../hardwareHandler/hardwareHandler';
import { WebhookConnector } from 'webhookconnector';

export class AppHandler extends BasicAppHandler {
    private hardwareHandler: HardwareHandler
    private webhookConnector: WebhookConnector;

    constructor(hardwareHandler, webhookConnector: WebhookConnector) {
        super();
        this.webhookConnector = webhookConnector;
        this.hardwareHandler = hardwareHandler;
    }

    public init() {

    }

    public getUptime(socket) {
        this.hardwareHandler.getUptime((uptime) => {
            socket.emit('uptime', uptime);
        });
    }

    public getCaptcha(socket) {
        this.hardwareHandler.getCaptcha((captcha) => {
            socket.captchaText = captcha.text;
            socket.emit('captcha', captcha.data);
        });
    }

    public checkCaptcha(socket, text) {
        // console.log('text', text);
        // console.log('captchaText', socket.captchaText);
        socket.emit('captchaChecked', (socket.captchaText == text));
    }

    public getSpace() {
        this.hardwareHandler.getSpace();
    }

    public getVideos() {
        this.hardwareHandler.getVideos();
    }

    public uploadVideo(video) {
        this.hardwareHandler.uploadVideo(video);
    }

    public uploadImage(image) {
        this.hardwareHandler.uploadImage(image);
    }

    public getWifiConnections() {
        this.hardwareHandler.getWifiConnections();
    }

    public getWifiConnected() {
        this.hardwareHandler.getWifiConnected();
    }

    public subscribeDisk(socket) {
        this.hardwareHandler.subscribeDisk((data) => {
            socket.emit('disk', data);
        });
    }

    public subscribeGPS(socket) {
        this.hardwareHandler.subscribeGPS((data) => {
            socket.emit('gPS', data);
        });
    }

    public subscribeGSM(socket) {
        this.hardwareHandler.subscribeGSM((data) => {
            socket.emit('gSM', data);
        });
    }

    public subscribeWifi(socket) {
        this.hardwareHandler.subscribeWifi((data) => {
            socket.emit('wifi', data);
        });
    }

    public checkIsOnline(socket) {
        this.hardwareHandler.checkIsOnline((online) => {
            socket.emit('online', online);
        });
    }

    public setWifiConnection(data) {
        let _self = this;
        this.hardwareHandler.setWifiConnection(data);
    }

    public appPublish(subscribers, data) {
        this.hardwareHandler.appPublish(subscribers, data);
    }

    public appSubscribe(subscribers, socket) {
        this.hardwareHandler.appSubscribe(subscribers, (data) => {
            socket.emit(subscribers, data);
        });
    }

    public appSubscribeStream(subscribers, socket) {
        this.hardwareHandler.appSubscribe(subscribers, (data) => {
            socket.emit('stream', data);
        });
    }

    public refresh(request: Request, response: Response, nextFunction: NextFunction) {
        this.webhookConnector.upgrade(request.body);
    }

    public configSocket(basicSocket: BasicSocket) {
        let _self = this;
        basicSocket.on('getUptime', () => { _self.getUptime(basicSocket); });
        basicSocket.on('getCaptcha', () => { _self.getCaptcha(basicSocket); });
        basicSocket.on('checkCaptcha', (text) => { _self.checkCaptcha(basicSocket, text); });

        basicSocket.on('getSpace', () => { _self.getSpace(); });

        basicSocket.on('subscribeStream', () => { _self.appSubscribeStream('streamOut', basicSocket); });
        basicSocket.on('stream', (stream) => { _self.appPublish('streamIn', stream); });


        basicSocket.on('uploadVideo', (video) => { _self.uploadVideo(video); });
        basicSocket.on('uploadImage', (image) => { _self.uploadImage(image); });
        basicSocket.on('getVideos', () => { _self.getVideos(); });
        basicSocket.on('subscribeDisk', () => { _self.subscribeDisk(basicSocket); });

        basicSocket.on('subscribeGPS', () => { _self.subscribeGPS(basicSocket); });
        basicSocket.on('subscribeGSM', () => { _self.subscribeGSM(basicSocket); });

        basicSocket.on('checkIsOnline', () => { _self.checkIsOnline(basicSocket); });

        basicSocket.on('getWifiConnected', () => { _self.getWifiConnected(); });
        basicSocket.on('getWifiConnections', () => { _self.getWifiConnections(); });
        basicSocket.on('setWifiConnection', (data) => { _self.setWifiConnection(data); });
        basicSocket.on('subscribeWifi', () => { _self.subscribeWifi(basicSocket); });
    }
}
