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

export default Timer;
