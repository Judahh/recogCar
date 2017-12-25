import { AppObject, Component, ComponentDataInput, ComponentOption, ComponentDivisor, Util, Socket  } from 'backappjh';
import * as Moment from 'moment';

export class Time extends AppObject {
    private socketIo;
    private static instance: Time;

    constructor(father?: Component) {
        super(father);
    }

    public static getInstance(father?: Component): Time {
        if (!Time.instance) {
            Time.instance = new Time(father);
        }
        return Time.instance;
    }

    public getTime(component) {
        // console.log('RUN TIME:' + Util.getInstance().getBrowserLanguage());
        let time = Time.getInstance();
        let today = new Date();
        let hours = today.getHours();
        let m: number = today.getMinutes();
        let minutes: string;

        if (m < 10) {
            minutes = '0' + m;
        } else {
            minutes = '' + m;
        }

        if (document.getElementById(component.getElement().id) != null) {
            component.getElement().innerHTML = hours + ':' + minutes;
            let t = setTimeout(() => { time.getTime(component); }, 5000);
        }
    }

    public getUptime(component) {
        // console.log('RUN!!');
        let time = Time.getInstance();
        time.socketIo = Socket.getInstance();
        time.socketIo.emit('getUptime', {});
        time.socketIo.on('uptime', (data) => { time.uptime(component, data); });
    }

    public uptime(component, data) {
        let timeC = Time.getInstance();
        let nowDate = new Date();
        let uptime: any = new Date(data);
        let now = Moment(nowDate, 'DD/MM/YYYY HH:mm:ss');
        uptime = Moment(uptime, 'DD/MM/YYYY HH:mm:ss');
        let days = now.diff(uptime, 'days');
        let months = now.diff(uptime, 'months');
        let years = now.diff(uptime, 'years');
        let time

        if (years > 0) {
            time = Moment.utc(now.diff(uptime)).format('DD/MM/YYYY HH:mm');
        } else if (months > 0) {
            time = Moment.utc(now.diff(uptime)).format('DD/MM HH:mm');
        } else if (days > 0) {
            time = Moment.utc(now.diff(uptime)).format('DD HH:mm');
        } else {
            time = Moment.utc(now.diff(uptime)).format('HH:mm');
        }

        // console.log('TIME:' + time);
        if (document.getElementById(component.getElement().id) != null) {
            component.getElement().innerHTML = time;// hours + ':' + minutes;
            let t = setTimeout(() => { timeC.uptime(component, data); }, 10000);
        }
    }

}