export default class Voice extends OscillatorNode {
    private gain: GainNode;

    constructor(context: AudioContext, type: OscillatorType) {
        super(context);

        this.gain = context.createGain();
        this.gain.connect(context.destination);

        this.connect(this.gain);

        this.type = type;
    }

    setVolume = (value: number): void => {
        this.gain.gain.value = value;
    }
}