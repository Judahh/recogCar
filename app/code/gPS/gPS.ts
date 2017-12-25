import { AppObject, Component, ComponentPageBody, ComponentInformation, Observer, Socket } from 'backappjh';

export class GPS extends AppObject implements Observer {
    private socketIo;
    private static instance: GPS;
    private subscribers: Array<any>;

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public static getInstance(father?: Component): GPS {
        if (!GPS.instance) {
            GPS.instance = new GPS(father);
        }
        return GPS.instance;
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = Socket.getInstance();
        _self.socketIo.emit('subscribeGPS', {});
        _self.socketIo.on('gPS', (data) => { _self.publish(data); });
    }

    public subscribe(callback) {
        //we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to GPS');
    }

    public unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((element) => {
            return element !== callback;
        });
    }

    public publish(data) {
        this.subscribers.forEach((subscriber) => {
            subscriber(data);
        });
    }

    public run(component) {
        let gPS = GPS.getInstance();
        gPS.subscribe((data) => { gPS.runGPS(component, data); });
    }

    public runGPS(component, data) {
        let _self = this;
        // console.log("GPS:",data);
        if (data) {
            (<ComponentInformation>component).getElement().innerHTML = '';
        } else {
            (<ComponentInformation>component).getElement().innerHTML = '';
        }
    }
}