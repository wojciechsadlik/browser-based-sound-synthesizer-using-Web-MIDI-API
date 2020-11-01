export default class Oscilloscope {
    readonly analyser: AnalyserNode;

    constructor(context: AudioContext) {
        this.analyser = context.createAnalyser();
        
        this.analyser.connect(context.destination);
    }
}