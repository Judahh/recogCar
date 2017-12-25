import { AppObject, Component, ComponentPageBody } from 'backappjh';
import { GPS } from './gPS';
import { SVG } from './../sVG/sVG';

export class GPSData extends AppObject {
    private gPS: GPS;
    private size: number;
    private center: number;
    private width: number;
    private height: number;
    private barHeight: number;
    private boxBarHeight: number;
    private boxBarWidth: number;
    private padding: number;
    private svgSky;
    private svgSatelites;
    private satelitesGroup;

    constructor(father?: Component) {
        super(father);
    }

    public run() {
        console.log('GPS!!!');
        let _self = this;
        _self.gPS = GPS.getInstance();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let markerPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // console.log('markerPosition:');
                // console.log(markerPosition);

                (<ComponentPageBody>_self.father).arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayMap[0].arrayMarker[0].setPosition(markerPosition);
                (<ComponentPageBody>_self.father).arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayMap[0].map.setCenter(markerPosition);
            }, () => {
            });
        }
        _self.initDashboard();
        _self.gPS.subscribe((data) => { _self.response(data); });
    }

    public response(data) {
        // console.log('data:', data);
        this.checkInit();
        this.updateDashboard(data.gpsState);
    }

    private checkInit() {
        if (this.father != undefined && (<ComponentPageBody>this.father).arrayDivisor[3] != undefined) {
            let D3 = SVG.getInstance().getD3();
            let svgS = (<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[1].getElement().children;
            // console.log('svg:', svgS);
            if (svgS.length == 0) {
                this.initDashboard();
            }
        }
    }

    public updateMap(data) {
        let _self = this;
        if (data.lat != undefined) {
            let markerPosition = {
                lat: data.lat,
                lng: data.lon
            };

            (<ComponentPageBody>_self.father).arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayMap[0].arrayMarker[0].setPosition(markerPosition);
            (<ComponentPageBody>_self.father).arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayMap[0].map.setCenter(markerPosition);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let markerPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    (<ComponentPageBody>_self.father).arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayMap[0].arrayMarker[0].setPosition(markerPosition);
                    (<ComponentPageBody>_self.father).arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayMap[0].map.setCenter(markerPosition);
                },() => {
                });
            }
        }
    }

    public initDashboard() {
        let D3 = SVG.getInstance().getD3();

        //Width and height

        // this.bigCenter = parseInt((<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[0].arrayCircle[0].getElement().getAttribute("cx"), 10);
        this.width = (<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[0].getElement().getBoundingClientRect().width;
        this.height = (<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[0].getElement().getBoundingClientRect().width;
        this.size = (2 * this.height) / 5;
        this.center = this.height / 2;

        this.boxBarWidth = (<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[1].getElement().getBoundingClientRect().width;
        this.boxBarHeight = (<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[1].getElement().getBoundingClientRect().width;
        this.barHeight = this.boxBarHeight - 20;

        this.padding = 1;

        //Create SVG elements
        this.svgSky = D3.select("#" + (<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[0].getElement().id).attr("height", this.height);

        this.svgSatelites = D3.select("#" + (<ComponentPageBody>this.father).arrayDivisor[3].arrayDivisor[0].arrayDivisor[0].arraySVG[1].getElement().id).attr("height", this.boxBarHeight).append("g");

        for (let index = 0; index < 90; index += 30) {
            this.svgSky.append("circle")
                .attr("cx", this.width / 2)
                .attr("cy", this.height / 2)
                .attr("r", this.elevationToRadius(index, this.size))
                .attr("fill", "none")
                .attr("stroke", "black");
            this.svgSky.append("text")
                .attr("x", this.elevationToRadius(index + 30, this.size) + this.width / 2 + this.center / 10)
                .attr("y", this.height / 2 - this.center / 30)
                .attr("fill", "black")
                .attr("text-anchor", "end")
                .attr("font-size", "8")
                .text((30 + index) + "°");
        }

        this.svgSky.append("line")
            .attr("x1", this.width / 2)
            .attr("y1", this.height / 2 - this.elevationToRadius(30, this.size))
            .attr("x2", this.width / 2)
            .attr("y2", this.height / 2 + this.elevationToRadius(30, this.size))
            .attr("stroke", "black");
        this.svgSky.append("line")
            .attr("x1", this.width / 2 - this.elevationToRadius(30, this.size))
            .attr("y1", this.height / 2)
            .attr("x2", this.width / 2 + this.elevationToRadius(30, this.size))
            .attr("y2", this.height / 2)
            .attr("stroke", "black");


        let steps = 36;

        for (let index = 0; index < steps; index++) {
            let alpha = (index / steps - 90 / 360) * Math.PI * 2;
            let L = (index % 3 === 0) ? 15 : 5;
            this.svgSky.append("line")
                .attr("x1", Math.cos(alpha) * this.size + this.width / 2)
                .attr("y1", Math.sin(alpha) * this.size + this.height / 2)
                .attr("x2", Math.cos(alpha) * (this.size - L) + this.width / 2)
                .attr("y2", Math.sin(alpha) * (this.size - L) + this.height / 2)
                .attr("stroke", "black");
            if (index % 4.5 == 0)
                this.svgSky.append("text")
                    .attr("x", Math.cos(alpha) * (this.size + 10) + this.width / 2)
                    .attr("y", Math.sin(alpha) * (this.size + 10) + this.height / 2 + 3)
                    .attr("fill", "black")
                    .attr("text-anchor", "middle")
                    .attr("font-size", "8")
                    .text(Math.round(90 + alpha / Math.PI * 180) + "°");
        }

        this.satelitesGroup = this.svgSky.append("g");
    }

    public updateDashboard(data) {
        if (this.father != undefined) {
            try {
                this.updateMap(data);
                this.updateSatellite(data);
                this.updateTable(data);
                this.updateSkyView(data);
            } catch (error) {
                // this.initDashboard();
                // console.error(error);
            }
        }
    }

    public elevationToRadius(elevation, size) {
        // Degrees:
        // 0° has radius of 120
        // 90° has radius of 0
        return size * (1 - elevation / 90);
    }

    public updateSatellite(data) {
        let rect = this.svgSatelites.selectAll("rect")
            .data(data.satsVisible);
        let text = this.svgSatelites.selectAll("text")
            .data(data.satsVisible);

        let _self = this;

        rect
            .enter()
            .append("rect");
        rect
            .enter()
            .append("text").attr("font-size", "8");
        rect
            .attr("x", (d, i) => {
                return i * (_self.boxBarWidth / data.satsVisible.length);
            })
            .attr("y", (d) => {
                let v = d.snr || 0;
                return _self.barHeight - (v * 4);
            })
            .attr("width", _self.boxBarWidth / data.satsVisible.length - _self.padding)
            .attr("height", (d) => {
                let v = d.snr || 0;
                return v * 4;
            })
            .attr("fill", (d) => {
                // console.log(d);
                // console.log(d.snr);
                let v = d.snr || 0;
                if (-1 !== data.satsActive.indexOf(d.prn)) {
                    return "rgb(0, 0, " + (v * 10 | 0) + ")";
                }
                return "rgb(" + (v * 10 | 0) + ", 0, 0)";
            });
        text
            .attr("x", (d, i) => {
                return (2 * (_self.boxBarWidth / data.satsVisible.length - _self.padding)) / 5 + i * (_self.boxBarWidth / data.satsVisible.length);
            })
            .attr("y", _self.barHeight + 20)
            .text((d) => {
                return d.prn;
            })
            .attr("fill", "black");
        rect
            .exit()
            .remove();
        text
            .exit()
            .remove();
    }

    public updateSkyView(data) {
        let _self = this;

        let circle = this.satelitesGroup.selectAll("circle")
            .data(data.satsVisible);

        circle
            .enter()
            .append("circle");
        circle
            .attr("cx", (d, i) => {
                return _self.width / 2 + Math.cos(d.azimuth / 180 * Math.PI - Math.PI / 2) * _self.elevationToRadius(d.elevation, _self.size);
            })
            .attr("cy", (d, i) => {
                return _self.height / 2 + Math.sin(d.azimuth / 180 * Math.PI - Math.PI / 2) * _self.elevationToRadius(d.elevation, _self.size);
            })
            .attr("r", 5)
            .attr("fill", (d) => {
                let v = d.snr || 0;
                if (-1 !== data.satsActive.indexOf(d.prn)) {
                    return "rgb(0, 0, " + (v * 10 | 0) + ")";
                }
                return "rgb(" + (v * 10 | 0) + ", 0, 0)";
            });
        circle
            .enter()
            .append("title")
            .text((d, i) => {
                return d.prn;
            });
    }

    public updateTable(state) {
        // console.log('data:'+state);
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[0].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.time;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[1].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.fix;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[2].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.lat;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[3].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.lon;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[4].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.alt;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[5].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.speed;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[6].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.satsActive.length;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[7].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.satsVisible.length;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[8].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.pdop;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[9].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.vdop;
        (<ComponentPageBody>this.father).arrayDivisor[4].arrayDivisor[0].arrayDivisor[10].arrayItem[1].colorEffect.font.animationEffect.animationSubEffect.arrayAnimationSubEffectHolder[0].information.getElement().innerHTML = state.hdop;
    }
}