// import { VideoCapture, NamedWindow } from 'opencv';

export class Camera {
    // private camera;
    // private namedWindow;

    /**
     * Initialize the HeroRouter
     */
    // constructor() {
    //     // camera properties
    //     let camWidth = 640;
    //     let camHeight = 480;
    //     let camFps = 10;
    //     let camInterval = 1000 / camFps;
    //     // initialize camera
    //     let camera = new VideoCapture(0);
    //     // this.camera
    //     camera.setWidth(camWidth);
    //     camera.setHeight(camHeight);
    //     console.log("cam");
    //     let namedWindow = new NamedWindow('Video', 1);
    //     let _self = this;
    //     setInterval(function () {
    //         camera.read(function (err, im) {
    //             if (err) {
    //                 console.log(err);//throw err;
    //             } else {

    //                 // _self.socket.emit('frame', { buffer: im.toBuffer() });
    //                 // res.send({ buffer: im.toBuffer() });
    //                 if (im.width() > 0 && im.height() > 0) {
    //                     // console.log("Width:" + im.width());
    //                     // console.log("height:"+ im.height());
    //                     namedWindow.show(im);
    //                 }
    //             }
    //         });
    //     }, camInterval);
    // }

    public getCamera() {
        // return this.camera;
    }

}
