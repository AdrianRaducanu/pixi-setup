import Engine from "./Engine.js";
import gsap from "gsap";

class SingletonEnforcer {}

export default class AnimationManager {
    timeline;
    lastLoggedTime = 0;
    actions = {
        play: () => this.timeline.play(),
        pause: () => this.timeline.pause(),
        goToTime: (time) => {
            this.timeline.pause();
            this.timeline.time(time);
        },
    }

    static get instance() {
        if (!SingletonEnforcer._instance) {
            SingletonEnforcer._instance = new AnimationManager(new SingletonEnforcer());
        }
        return SingletonEnforcer._instance;
    }

    constructor(enforcer) {
        if (!enforcer || !(enforcer instanceof SingletonEnforcer)) {
            throw new Error("Use AnimationManager.instance!");
        }
        SingletonEnforcer._instance = this;
    }

    create() {
        const g1 = Engine.instance.getFromStage('g1');
        const g2 = Engine.instance.getFromStage('g2');

        if(this.timeline) {
            this.timeline.kill();
        }
        this.timeline = gsap.timeline({
            paused: true ,
            onUpdate: () => this.updateTimer()
        });

        this.timeline.to(g1, { alpha: 1, duration: 1, ease: "power2.inOut" }, 0);
        this.timeline.to(g1, { alpha: 0, duration: 1, ease: "power2.inOut" }, 5);
        this.timeline.to(g2, { alpha: 1, duration: 1, ease: "power2.inOut" }, 5);
        this.timeline.to(g2, { alpha: 0, duration: 1, ease: "power2.inOut" }, 15);
    }

    updateTimer() {
        const currentTime = this.timeline.time();
        if (currentTime - this.lastLoggedTime >= 0.1 || currentTime === 0) {
            console.log(currentTime.toFixed(1));
            this.lastLoggedTime = currentTime;
        }
    }
}