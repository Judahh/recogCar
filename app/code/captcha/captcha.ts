import { AppObject, Component, ComponentDivisor, ComponentPageBody, ComponentDataInput, ComponentOption, Observer, Socket } from 'backappjh';

export class Captcha extends AppObject implements Observer {
    private socketIo;
    private static instance: Captcha;
    private subscribers: Array<any>;

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public static getInstance(father?: Component): Captcha {
        if (!Captcha.instance) {
            Captcha.instance = new Captcha(father);
        }
        return Captcha.instance;
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = Socket.getInstance();
        _self.socketIo.on('captcha', (data) => { _self.publish({ captcha: data }); });
        _self.socketIo.on('captchaChecked', (data) => { _self.publish({ verified: data }); });
    }

    public getCaptchaImage() {
        let _self = this;
        _self.socketIo.emit('getCaptcha', {});
    }

    public checkCaptchaImage(text) {
        let _self = this;
        _self.socketIo.emit('checkCaptcha', text);
    }

    public subscribe(callback) {
        //we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to Disk');
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

    public getCaptcha(component) {
        let captcha = Captcha.getInstance();
        captcha.subscribe((data) => {
            captcha.captcha(component, data);
        });
        captcha.getCaptchaImage();
    }

    public checkCaptcha(component) {
        let captcha = Captcha.getInstance();
        captcha.checkCaptchaImage("text");
    }

    public captcha(component, data) {
        if (data.captcha) {
            (<ComponentDivisor>component).getElement().innerHTML = data.captcha;
        } else {
            console.log(data.verified);
        }
    }
}