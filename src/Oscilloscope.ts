export default class Oscilloscope {
    readonly analyser: AnalyserNode;
    private dataArray: Uint8Array;
    private canvasCtx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private then: number;
    private frequency: number;
    private fpsInterval: number;

    constructor(audioCtx: AudioContext, canvas: HTMLCanvasElement) {
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        let bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        this.canvas = canvas;
        
        if (canvas.getContext('2d'))
            this.canvasCtx = canvas.getContext('2d')!;
        else
            throw new Error('Can\'t get canvas context');
        
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.then = Date.now();
        this.frequency = 220;
        this.fpsInterval = 1000.0 / 30.0;
    }

    public setDestination = (destination?: AudioNode) => {
        this.analyser.disconnect();
        if (destination)
            this.analyser.connect(destination);
        else
            this.analyser.connect(this.analyser.context.destination);
    }

    public disconnect = () => {
        this.analyser.disconnect();
    }

    public setFrequency = (frequency: number) => {
        this.frequency = frequency;
    }

    public drawLoop = () => {
        let drawFrame = requestAnimationFrame(this.drawLoop);
        let now = Date.now();
        let elapsed = now - this.then;

        let timeout = this.fpsInterval * 1000.0 / this.frequency;

        if (elapsed >= timeout) {
            this.drawPlot();
            //console.log(`${elapsed} => ${elapsed - timeout}`);

            this.then = now - elapsed % timeout;
        }
    }

    private drawPlot = () => {
        this.analyser.getByteTimeDomainData(this.dataArray);
        
        this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        this.canvasCtx.beginPath();
        
        const bufferLength = this.dataArray.length;
        const sliceWidth = this.canvas.width / bufferLength;

        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            let v = this.dataArray[i] / 128.0;
            let y = v * this.canvas.height / 2;

            if (i === 0 ) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.canvasCtx.stroke();
    }
}