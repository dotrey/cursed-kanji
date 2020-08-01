import TouchHandler from "../../touched/TouchHandler.js";
import m from "../ui/Mithril.js";

export default class GameInput {

    proposedText : string = "";
    private maxTextLength : number = 24;
    private changeListeners : ((proposedText : string) => void)[] = [];
    private swipeAfterScreenPercentage : number = 0.15;
    private cancelTouchUpAfterScreenPercentage : number = 0.05;

    registerRomajiProposal(id : string) {
        let romajiProposal : HTMLElement = document.getElementById(id);
        if (!romajiProposal) {
            return;
        }
        this.registerClearProposal(romajiProposal);
        this.registerUndoProposal(romajiProposal);
    }

    private registerClearProposal(container : HTMLElement) {
        let touchOptions = {
            onTouchUp : (e : HTMLElement) => {
                this.clearProposal();
                m.redraw();
            }
        };

        for (let key of container.querySelectorAll(".romaji-proposal-clear")) {
            new TouchHandler(key as HTMLElement, touchOptions);
        }
    }

    private registerUndoProposal(container : HTMLElement) {
        let touchOptions = {
            onTouchUp : (e : HTMLElement) => {
                this.undoPropose();
                m.redraw();
            }
        };

        for (let key of container.querySelectorAll(".romaji-proposal-undo")) {
            new TouchHandler(key as HTMLElement, touchOptions);
        }
    }


    registerRomajiBoard(id : string) {
        let romajiBoard : HTMLElement = document.getElementById(id);
        if (!romajiBoard) {
            return;
        }
        this.registerKeys(romajiBoard);
        this.registerScrollRow(romajiBoard);
    }

    private registerKeys(container : HTMLElement) {
        let touchOptions = {
            onTouchUp : (e : HTMLElement) => {
                this.propose(e.getAttribute("data-key") || "");
                m.redraw();
            },
            // allow dragging for 5% of width before cancelling the touch up event
            cancelTouchUpThreshold : Math.floor(container.offsetWidth * this.cancelTouchUpAfterScreenPercentage)
        };

        for (let key of container.querySelectorAll(".romajiboard-key")) {
            new TouchHandler(key as HTMLElement, touchOptions);
        }
    }

    private registerScrollRow(container : HTMLElement) {
        let scrollRow : HTMLElement = container.querySelector(".romajiboard-scrollrow[data-scrollable]");
        let touchOptions = {
            cancelTouchUpAfterMove : false,
            onTouchMove : (e : HTMLElement, dx : number, dy : number) => {
                // invert the drag direction
                dx *= -1;
                let snap : number = parseInt(scrollRow.getAttribute("data-scrollsnap") || "0");
                let panelWidth : number = (scrollRow.firstElementChild as HTMLElement).offsetWidth;
                scrollRow.scrollLeft = Math.max(0, snap * panelWidth + dx);
                let scrollPercentage : number = Math.abs(dx / panelWidth);
                if (scrollPercentage >= this.swipeAfterScreenPercentage) {
                    if (dx > 0) {
                        snap++;
                    }else{
                        snap--;
                    }
                    snap = Math.max(0, Math.min(scrollRow.childElementCount - 1, snap));
                    scrollRow.setAttribute("data-scrollsnap", "" + snap);
                    this.scrollTo(scrollRow, snap * panelWidth);
                    return true;
                }
                return false;
            },
            onTouchUp : (e : HTMLElement) => {
                let snap : number = parseInt(scrollRow.getAttribute("data-scrollsnap") || "0");
                let panelWidth : number = (scrollRow.firstElementChild as HTMLElement).offsetWidth;
                this.scrollTo(scrollRow, snap * panelWidth);
            }
        };

        new TouchHandler(container, touchOptions);
    }

    private clearScrollTimeout(e : HTMLElement) {
        let timeout : string = e.getAttribute("data-scroll-timeout");
        if (timeout) {
            window.clearTimeout(parseInt(timeout));
            e.setAttribute("data-scroll-timeout", "");
        }
    }

    private scrollTo(e : HTMLElement, target : number, speed : number = 10, delay : number = 5) {
        this.clearScrollTimeout(e);
        this._scrollTo(e, target, speed, delay);
    }

    private _scrollTo(e : HTMLElement, target : number, speed : number = 10, delay : number = 5) {
        let x : number = e.scrollLeft;
        e.setAttribute("data-scroll-timeout", "");
        if (Math.abs(target - x) < speed) {
            e.scrollLeft = target;
            this.clearScrollTimeout(e);
        }else{
            if (x > target) {
                x -= speed;
            }else{
                x += speed;
            }
            e.scrollLeft = x;
            e.setAttribute("data-scroll-timeout", "" + window.setTimeout(() => {
                this._scrollTo(e, target, speed, delay);
            }, delay));
        }
    }

    private propose(key : string) {
        if (this.proposedText.length >= this.maxTextLength) {
            return;
        }
        this.proposedText += key;
        this.notifyChangeListeners();
    }

    clearProposal() {
        this.proposedText = "";
        this.notifyChangeListeners();
    }

    private undoPropose() {
        if (this.proposedText.length) {
            this.proposedText = this.proposedText.substr(0, this.proposedText.length - 1);
            this.notifyChangeListeners();
        }
    }

    private notifyChangeListeners() {
        for(const listener of this.changeListeners) {
            listener(this.proposedText);
        }
    }

    attach(callback : (proposedText : string) => void) {
        if (this.changeListeners.indexOf(callback) < 0) {
            this.changeListeners.push(callback);
        }
    }

    detach(callback : (proposedText : string) => void) {
        const i : number = this.changeListeners.indexOf(callback);
        if (i > -1) {
            this.changeListeners.splice(i, 1);
        }
    }
}