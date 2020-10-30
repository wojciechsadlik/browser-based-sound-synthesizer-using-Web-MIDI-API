export default class Voice extends OscillatorNode {
    private gain: GainNode;
    private delay: DelayNode;

    constructor(context: AudioContext, type: OscillatorType, destination: AudioNode) {
        super(context);

        this.type = type;
        
        this.gain = context.createGain();
        this.gain.connect(destination);

        this.delay = context.createDelay();
        this.delay.connect(this.gain);

        this.connect(this.delay);
    }

    setVolume = (value: number): void => {
        this.gain.gain.value = value;
    }

    setDelay = (value: number, frequency: number): void => {
        value = Math.max(0, Math.min(value, 1));
        this.delay.delayTime.value = value / frequency;         // value * (1 / frequency) 
    }
}