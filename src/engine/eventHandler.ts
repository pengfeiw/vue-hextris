class EventHandler {
    resizeHandler?: () => void;
    public init() {
        if (this.resizeHandler) {
            window.addEventListener("resize", this.resizeHandler);
        }
    }
    public dispose() {
        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler);
        }
    }
}


export default EventHandler;
