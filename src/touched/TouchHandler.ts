export default class TouchHandler {

    // The css classes that are set if an matching event occurs
    private cssTouchDown : string = "touched-down";
    private cssTouchUp : string = "touched-up";
    private cssTouchMove : string = "touched-move";

    // The max. number of simultaneous touches to track
    private touchLimit : number = 1;

    // If true, the touch up event will be ignore if the touch moved
    // more than the set threshold
    private cancelTouchUpAfterMove : boolean = true;
    private cancelTouchUpThreshold : number = 5; // pixel

    // The handlers for touch start and end
    private onTouchDown : (element : HTMLElement) => void;
    private onTouchUp : (element : HTMLElement) => void;
    // The handler for touch move, providing the overall moved distance since touch start.
    // If the handler returns true, the touchpoint will be removed.
    private onTouchMove : (element : HTMLElement, deltaX : number, deltaY : number) => boolean;

    private ongoingTouches : Touch[] = [];

    constructor(private element : HTMLElement, options : {[index : string] : any} = {}) {
        this.applyOptions(options);
        this.attach();
    }

    private attach() {
        this.element.addEventListener("touchstart", this.handleTouchStart.bind(this));
        this.element.addEventListener("touchmove", this.handleTouchMove.bind(this));
        this.element.addEventListener("touchend", this.handleTouchEnd.bind(this));
        this.element.addEventListener("touchcancel", this.handleTouchEnd.bind(this));
    }

    private handleTouchStart(e : TouchEvent) {
        e.preventDefault();
        if (this.ongoingTouches.length >= this.touchLimit) {
            // already observing the max number of touches
            return;
        }
        for (let touch of e.changedTouches) {
            this.ongoingTouches.push(this.copyTouch(touch));
        }
        if (this.ongoingTouches.length) {
            this.element.classList.add(this.cssTouchDown);
            this.element.classList.remove(this.cssTouchUp);
        }
        if (typeof this.onTouchDown === "function") {
            this.onTouchDown(this.element);
        }
    }

    private handleTouchMove(e : TouchEvent) {
        e.preventDefault();
        for (let touch of e.changedTouches) {
            let i : number = this.ongoingTouchIndex(touch);
            if (i >= 0) {
                let oldTouch : Touch = this.ongoingTouches[i];
                let dx : number = touch.pageX - oldTouch.pageX;
                let dy : number = touch.pageY - oldTouch.pageY;
                
                if (typeof this.onTouchMove === "function") {
                    if (this.onTouchMove(this.element, dx, dy)) {
                        // the handler returned true, indicating to release the touch
                        this.ongoingTouches.splice(i, 1);
                    }
                }
            }
        }
    }

    private handleTouchEnd(e : TouchEvent) {
        e.preventDefault();
        for (let touch of e.changedTouches) {
            let i : number = this.ongoingTouchIndex(touch);
            if (i > -1) {
                let oldTouch : Touch = this.ongoingTouches.splice(i, 1)[0];

                if (this.cancelTouchUpAfterMove) {
                    let dx : number = touch.pageX - oldTouch.pageX;
                    let dy : number = touch.pageY - oldTouch.pageY;
                    if(dx * dx + dy * dy >= this.cancelTouchUpThreshold * this.cancelTouchUpThreshold) {
                        // moved to far, ignore this touch-up
                        continue;
                    }
                }
                if (typeof this.onTouchUp === "function") {
                    this.onTouchUp(this.element);
                }
            }
        }
        if (!this.ongoingTouches.length) {
            this.element.classList.remove(this.cssTouchDown);
            this.element.classList.add(this.cssTouchUp);
        }
    }

    private copyTouch(touch : Touch) : Touch {
        return new Touch(touch);
    }

    private ongoingTouchIndex(touch : Touch) : number {
        for (let i = 0, ic = this.ongoingTouches.length; i < ic; i++) {
            if (this.ongoingTouches[i].identifier === touch.identifier) {
                return i;
            }
        }

        return -1;
    }

    private applyOptions(options : {[index : string] : any}) {
        this.cssTouchDown = (options["cssTouchDown"] ?? this.cssTouchDown) as string;
        this.cssTouchUp = (options["cssTouchUp"] ?? this.cssTouchUp) as string;
        this.cssTouchMove = (options["cssTouchMove"] ?? this.cssTouchMove) as string;

        this.cancelTouchUpAfterMove = typeof options["cancelTouchUpAfterMove"] !== "undefined" ?
            !!options["cancelTouchUpAfterMove"] : 
            this.cancelTouchUpAfterMove;
        this.cancelTouchUpThreshold = (options["cancelTouchUpThreshold"] ?? this.cancelTouchUpThreshold) as number ;
        
        this.onTouchDown = options["onTouchDown"] as (element : HTMLElement) => void || null;
        this.onTouchUp = options["onTouchUp"] as (element : HTMLElement) => void || null;
        this.onTouchMove = options["onTouchMove"] as (element : HTMLElement, deltaX : number, deltaY : number) => boolean || null;
    }
}