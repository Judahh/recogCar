import { GPS } from './../gPS/gPS';
import { GSM } from './../gSM/gSM';
import { Wifi } from './../wifi/wifi';
import { Disk } from './../disk/disk';
import { Parsers } from './../parser/parsers';
import { Identification } from './identification';
import { Handler, Event, Operation } from 'flexiblepersistence';
// import { Camera } from './../camera/camera';

import * as openalpr from 'node-openalpr';
import * as uptime from 'os-uptime';
import * as  svgCaptcha from 'svg-captcha';
import * as isOnline from 'is-online';
import { connection } from 'mongoose';


export class HardwareHandler {
    private gPS: GPS;
    private gSM: GSM;
    private wifi: Wifi;
    private disk: Disk;
    private parsers: Parsers;
    private handler: Handler;
    private static identification: Identification = new Identification();
    private appSubscribers: any;

    constructor() {
        this.parsers = Parsers.getInstance();
        this.handler = new Handler(process.env.HORUS_DB, process.env.HORUS_DB_HOST, parseInt(process.env.HORUS_DB_PORT, 10));
        this.gPS = new GPS(this.parsers.getParser(process.env.GPS_NMEA_SERIAL_PORT), this.parsers.getParser(process.env.GPS_AT_SERIAL_PORT), process.env.GPS_AT_COMMAND_INIT, process.env.GPS_AT_COMMAND_START, this.handler);
        this.gSM = new GSM(this.parsers.getParser(process.env.GSM_AT_SERIAL_PORT), process.env.GSM_AT_COMMAND_SIGNAL, process.env.GSM_AT_COMMAND_TYPE, parseInt(process.env.GSM_AT_COMMAND_DELAY, 10), this.handler);
        this.wifi = new Wifi(parseInt(process.env.WIFI_REFRESH_DELAY, 10), this.handler);
        this.disk = new Disk(this.handler);
        openalpr.Start();
        console.log('VERSION', openalpr.GetVersion());
        // this.identify('/Users/Judah/Desktop/test.jpg');
        // HANDLER SAMPLE
        // this.handler.addEvent(new Event(Operation.add, 'sample', 0));
        // this.handler.readArray('samples',(error, result: Array<any>)=>{});
        // this.handler.readById('samples', 0,(error, result: Array<any>)=>{});
        // this.handler.readOne('samples', 0,(error, result: Array<any>)=>{});
        // this.getCaptcha();
        this.appSubscribers = {};

    }

    public init() {

    }

    public static getIdentification() {
        return HardwareHandler.identification;
    }

    public identify(path) {
        console.log(openalpr.IdentifyLicense(path, function (error, output) {
            let results = output.results;
            console.log('results:', results);
        }));
    }

    public getSpace() {
        this.disk.getSpace();
    }

    public getVideos() {
        this.disk.getVideos();
    }

    public uploadVideo(video) {
        this.disk.uploadVideo(video);
    }

    public uploadImage(image) {
        this.disk.uploadImage(image);
    }

    public getWifiConnections() {
        this.wifi.scan();
    }

    public getWifiConnected() {
        this.wifi.getCurrentConnections();
    }

    public setWifiConnection(data) {
        this.wifi.connect(data);
    }

    public subscribeDisk(callback) {
        let _self = this;
        this.disk.subscribe((data) => {
            callback(data);
        });
    }

    public subscribeGPS(callback) {
        let _self = this;
        this.gPS.subscribe((data) => {
            callback(data);
        });
    }

    public subscribeGSM(callback) {
        let _self = this;
        this.gSM.subscribe((data) => {
            callback(data);
        });
    }

    public subscribeWifi(callback) {
        let _self = this;
        this.wifi.subscribe((data) => {
            callback(data);
        });
    }

    public getUptime(callback) {
        callback(uptime().toLocaleString());
    }

    public getCaptcha(callback?) {
        let color: boolean = (process.env.CAPTCHA_COLOR === '1');
        let captchaOptions = {
            size: this.getRandomInt(process.env.CAPTCHA_SIZE_MIN, process.env.CAPTCHA_SIZE_MAX),
            ignoreChars: process.env.CAPTCHA_IGNORE_CHARS,
            noise: this.getRandomInt(process.env.CAPTCHA_NOISE_MIN, process.env.CAPTCHA_NOISE_MAX),
            color: color,
            background: this.getRandomColor(process.env.CAPTCHA_background_MIN, process.env.CAPTCHA_background_MAX)
        };

        let captcha = svgCaptcha.create(captchaOptions);
        // console.log('captcha', captcha);
        if (callback !== undefined && callback != null) {
            callback(captcha);
        }
    }

    public checkIsOnline(callback) {
        let _self = this;
        isOnline().then((online) => {
            callback(online);
        }).fail(() => {
            callback(false);
        });
    }

    private checkAppSubscribers(subscribers) {
        if (this.appSubscribers[subscribers] == undefined) {
            this.appSubscribers[subscribers] = new Array<any>();
        }
    }

    public appSubscribe(subscribers, callback) {
        this.checkAppSubscribers(subscribers);
        this.appSubscribers[subscribers].push(callback);
        console.log(callback.name, 'has been subscribed to', subscribers);
    }

    public appUnsubscribe(subscribers, callback) {
        this.checkAppSubscribers(subscribers);
        this.appSubscribers[subscribers] = this.appSubscribers[subscribers].filter((element) => {
            return element !== callback;
        });
    }

    public appPublish(subscribers, data) {
        this.checkAppSubscribers(subscribers);
        this.appSubscribers[subscribers].forEach((subscriber) => {
            subscriber(data);
        });
    }

    public getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    public getRandomColor(min, max) {
        let minA: Array<string> = min.substr(1).match(/.{1,2}/g);
        let maxA: Array<string> = max.substr(1).match(/.{1,2}/g);
        let color = '#';

        for (let index = 0; index < minA.length; index++) {
            color += this.getRandomColorPart(parseInt('0x' + minA[index]), parseInt('0x' + maxA[index]));
        }
        return color;
    }


    public getRandomColorPart(min, max) {
        let number = this.getRandomInt(min, max);
        if (number < 16) {
            return '0' + number.toString(16);
        }
        return number.toString(16);
    }

}
