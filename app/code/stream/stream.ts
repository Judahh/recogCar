import { AppObject, Component, ComponentVideo, Socket } from 'backappjh';
import { Disk } from './../disk/disk';
import * as freeice from 'freeice';
declare var MediaRecorder: any;
declare var AudioContext: any;

export class Stream extends AppObject {
    private static instance: Stream;
    private stream;
    private canvas;
    private format: string;
    private video: any;
    private audio: boolean;
    private duration: number;
    private disk: Disk;
    private streamRecorder;
    private socketIo;
    private configuration;
    private streamConnection;
    private subscribers: Array<any>;

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = Socket.getInstance();
        _self.socketIo.emit('subscribeStream', {});
        _self.configuration = {
            "iceServers": [
                { url: "stun:stun.l.google.com:19302" },
                { url: "turn:71.6.135.115:3478", username: "test", credential: "tester" },
                { url: "turn:71.6.135.115:3479", username: "test", credential: "tester" }
            ]
        };
        _self.streamConnection = new webkitRTCPeerConnection(_self.configuration) || new RTCPeerConnection(_self.configuration);
        // console.log("STREAM:", _self.streamConnection);
        _self.socketIo.on('stream', (stream) => {
            if (stream.answer) {
                _self.handleAnswer(stream.answer);
            }
            if (stream.candidate) {
                // console.log("CANDIDATE!!!");
                _self.streamConnection.addIceCandidate(new RTCIceCandidate(stream.candidate));
            }
        });
    }

    public static getInstance(father?: Component): Stream {
        if (!Stream.instance) {
            Stream.instance = new Stream(father);
        }
        return Stream.instance;
    }

    public subscribe(callback) {
        //we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to GSM');
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

    public run() {
        console.log('STREAM!!!');
        let _self = this;
        _self.disk = Disk.getInstance();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: _self.video, audio: _self.audio }).then((stream) => {
                _self.stream = stream;
                _self.publish(stream);
                _self.configStream(stream);
                _self.startRecording();
            });
        } else {
            console.error('cam failed');
        }
    }

    private configStream(stream) {
        console.log("configStream!");
        let _self = this;

        // setup stream listening 
        _self.streamConnection.addStream(stream);

        // Setup ice handling 
        _self.streamConnection.onicecandidate = (event) => {
            // console.log("ICE!", event);
            if (event.candidate) {
                console.log("CANDIDATE:", event.candidate);
                _self.socketIo.emit('stream', { candidate: event.candidate });
            }

        };

        _self.streamConnection.createOffer(
            (offer) => {
                // console.log("CREATE OFFER!");
                _self.socketIo.emit('stream', { offer: offer });
                _self.streamConnection.setLocalDescription(offer);
            },
            (error) => {
                console.error("ERROR OFFER!", error);
            }
        );
    }

    private handleAnswer(answer) {
        // console.log("Answer!");
        let _self = this;
        _self.streamConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    public startRecording() {
        console.log('Start Record!!!');
        let _self = this;
        // _self.postFrameToServer(_self.stream);
        _self.streamRecorder = new MediaRecorder(_self.stream, {
            mimeType: ('video/' + _self.format)
        });
        _self.streamRecorder.start();
        _self.streamRecorder.ondataavailable = (e) => {
            _self.postVideoToServer(e.data);
        };
        setTimeout(() => { _self.restartRecording(); }, _self.duration);
    }

    public setDuration(duration: number) {
        this.duration = duration;
    }

    public getDuration() {
        return this.duration;
    }

    public setVideo(video: any) {
        let oldVideo = this.video;
        this.video = video;
        let _self = this;
        // _self.streamRecorder.stop();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: _self.video, audio: _self.audio }).then((stream) => {
                _self.stream = stream;
                // console.log(_self.stream);
                _self.configStream(stream);
                _self.startRecording();
            }).catch((error) => {
                _self.setVideo(oldVideo);
            });
        } else {
            console.error('cam failed');
        }
    }

    public getVideo() {
        return this.video;
    }

    public restartRecording() {
        // console.log('Stop Record!!!');
        let _self = this;
        _self.streamRecorder.stop();
        _self.streamRecorder.start();
        // console.log(_self.duration);
        setTimeout(() => { _self.restartRecording(); }, _self.duration);
    }

    public postVideoToServer(videoblob) {
        // console.log('Post Video to Server!!!');
        let _self = this;
        let data = {
            name: new Date(),
            video: videoblob,
            format: _self.format
        };
        _self.disk.uploadVideo(data);
    }

    // public postFrameToServer(stream) {
    //     // console.log('Post Video to Server!!!');
    //     let _self = this;
    //     let data = {
    //         name: new Date(),
    //         video: videoblob,
    //         format: _self.format
    //     };
    //     _self.disk.uploadVideo(data);
    // }

    public getStream() {
        return this.stream;
    }

    public getStreamView(component) {
        let stream = Stream.getInstance();
        stream.subscribe((streaming) => { stream.streamView(component, streaming); });
        let streaming = Stream.getInstance().getStream();
        if (streaming != undefined && streaming != null) {
            stream.streamView(component, streaming);
        }

    }

    public streamView(component, stream) {
        console.log('STREAMVIEW!!!');
        (<any>(<ComponentVideo>component).getElement()).src = window.URL.createObjectURL(stream);
        this.captuteStream(component, stream);
    }

    private captuteStream(component, stream) {
        if (this.canvas = undefined) {
            this.canvas = document.createElement('canvas');
        }
        let context2D = this.canvas.getContext('2d');
        context2D.drawImage(component, 0, 0);
        // get the canvas content as image data
        let imageData = context2D.getImageData(0, 0, component.width(), component.height());

        this.disk.uploadImage(imageData);
        this.captuteStream(component, stream);
    }
}
