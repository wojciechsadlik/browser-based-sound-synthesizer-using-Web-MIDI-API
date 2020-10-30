export default class Voice extends OscillatorNode {
    private gain: GainNode;

    constructor(context: AudioContext, type: OscillatorType, destination: AudioNode) {
        super(context);

        this.gain = context.createGain();
        this.gain.connect(destination);

        this.connect(this.gain);

        this.type = type;
    }

    setVolume = (value: number): void => {
        this.gain.gain.value = value;
    }
}