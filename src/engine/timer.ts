/* eslint-disable @typescript-eslint/no-non-null-assertion */
class Timer {
    private _timerId?: number;
    private _callback: () => void;
    private _remainTime: number;
    private _start = 0;
    public constructor(callback: () => void, delay: number, autoStart = true) {
        this._callback = callback;
        this._remainTime = delay;

        if (autoStart) {
            this.resume();
        }
    }

    public pause() {
        if (this._timerId) {
            window.clearTimeout(this._timerId);
            this._timerId = undefined;
            this._remainTime = Date.now() - this._start;
        }
    }

    public resume() {
        if (this._timerId) {
            return;
        }

        this._start = Date.now();
        this._timerId = window.setTimeout(this._callback, this._remainTime);
    }

    public start() {
        this.resume();
    }
}

class IntervalTimer {
    private _timerId?: number;
    private _startTime?: number;
    private _remaining?: number;
    private _interval: number;
    private _callback: () => void;
    /**
     * 0 - not start
     * 1 - time is running in window.setInterval
     * 2 - time is running in window.setTimeout
     * 3 - paused by window.clearInterval
     * 4 - paused by window.clearTimeout
     * */
    private state: 0 | 1 | 2 | 3 | 4 = 0;
    private timeoutTimer?: Timer;
    public constructor(callback: () => void, interval: number, autoStart = false) {
        this._callback = callback;
        this._interval = interval;
        if (autoStart) {
            this.start();
        }
    }
    public start() {
        if (this.state !== 0) {
            return;
        }

        this._startTime = Date.now();
        this._timerId = window.setInterval(this._callback, this._interval);
        this.toggleState();
    }
    public pause() {
        if (this.state !== 1 && this.state !== 2) {
            return;
        }

        if (this.state === 1) {
            this._remaining = this._interval - (Date.now() - this._startTime!);
            window.clearInterval(this._timerId);
        } else if (this.state === 2) {
            this.timeoutTimer!.pause();
        }

        this.toggleState();
    }

    public resume() {
        if (this.state !== 3 && this.state !== 4) {
            return;
        }

        if (this.state === 3) {
            this.timeoutTimer = new Timer(this.timeoutCallback.bind(this), this._remaining as number);
        } else if (this.state === 4) {
            this.timeoutTimer?.resume();
        }

        this.toggleState();
    }

    private timeoutCallback() {
        this._callback();
        this._startTime = Date.now();
        this._timerId = window.setInterval(this._callback, this._interval);
        this.state = 1;
    }

    /**
     * change state between paused(or idle) and running
     */
    private toggleState() {
        switch (this.state) {
            case 0:
                this.state = 1;
                break;
            case 1:
                this.state = 3;
                break;
            case 2:
                this.state = 4;
                break;
            case 3:
            case 4:
                this.state = 2;
                break;
            default:
                throw new Error("IntervalTimer: unkonw state");
        }
    }
}

export {Timer, IntervalTimer};
