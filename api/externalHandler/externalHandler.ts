import { path, BasicApi, BasicExternalHandler, BasicSocket } from 'backapijh';
import { HardwareHandler } from '../hardwareHandler/hardwareHandler';
import { compile } from 'morgan';

export class ExternalHandler extends BasicExternalHandler {
    private hardwareHandler: HardwareHandler;

    constructor(hardwareHandler: HardwareHandler) {
        super();
        this.hardwareHandler = hardwareHandler;
    }

    public init() {
        console.log('ID:', HardwareHandler.getIdentification());
        this.connectToServer(process.env.SERVER_ADDRESS, HardwareHandler.getIdentification());
        console.log('ID:', HardwareHandler.getIdentification());
        for (let index = 0; index < this.arraySocketClient.length; index++) {
            let socketClient = this.arraySocketClient[index];
            this.configSocket(socketClient);
        }
    }

    public getUptime(socket) {
        this.hardwareHandler.getUptime((uptime) => {
            socket.emit('uptime', uptime);
        });
    }

    public getWifiConnections(socket) {
        this.hardwareHandler.getWifiConnections();
    }

    public getWifiConnected(socket) {
        this.hardwareHandler.getWifiConnected();
    }

    public getVideos() {
        this.hardwareHandler.getVideos();
    }

    public uploadVideo(video) {
        this.hardwareHandler.uploadVideo(video);
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
            socket.emit('gsm', data);
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

    public configSocket(basicSocket: BasicSocket) {
        let _self = this;
        basicSocket.on('getUptime', () => { _self.getUptime(basicSocket); });

        basicSocket.on('uploadVideo', (video) => { _self.uploadVideo(video); });
        basicSocket.on('getVideos', () => { _self.getVideos(); });
        basicSocket.on('subscribeDisk', () => { _self.subscribeDisk(basicSocket); });

        basicSocket.on('subscribeGPS', () => { _self.subscribeGPS(basicSocket); });

        basicSocket.on('subscribeGSM', () => { _self.subscribeGSM(basicSocket); });

        basicSocket.on('checkIsOnline', () => { _self.checkIsOnline(basicSocket); });

        basicSocket.on('subscribeWifi', () => { _self.subscribeWifi(basicSocket); });
        basicSocket.on('getWifiConnected', () => { _self.getWifiConnected(basicSocket); });
        basicSocket.on('getWifiConnections', () => { _self.getWifiConnections(basicSocket); });
        basicSocket.on('setWifiConnection', (data) => { _self.setWifiConnection(data); });

        basicSocket.on('subscribeStream', () => {
            _self.appSubscribeStream('streamIn', basicSocket);
            basicSocket.emit('subscribeStream', {});//???
        });
        basicSocket.on('stream', (data) => {
            _self.appPublish('streamOut', data);
        });

        basicSocket.emit('subscribeStream', {});

    }
}
