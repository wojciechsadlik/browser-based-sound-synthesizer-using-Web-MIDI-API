import MIDI_Communicator from './MIDI_Communicator';
import SoundGenerator from './SoundGenerator';

const midiInputSelectElem = document.getElementById('MIDI_Input_sel') as HTMLSelectElement;
//const volumeElem = document.getElementById('volume') as HTMLInputElement;
const addWaveformBtnElem = document.getElementById('add_waveform_btn') as HTMLButtonElement;
const waveformsDivElem = document.getElementById('waveforms') as HTMLDivElement;

const audioContext = new window.AudioContext();
const soundGenerator = new SoundGenerator(audioContext);
//soundGenerator.setVolume(Number(volumeElem.value));

window.addEventListener('click', resumeAudioContext);

const midiCommunicator = new MIDI_Communicator();
midiCommunicator.init(midiInputSelectElem);
midiCommunicator.connectSoundGenerator(soundGenerator);

midiInputSelectElem.addEventListener('change', inputSelectChange);

//volumeElem.addEventListener('change', volumeChange);

addWaveformBtnElem.addEventListener('click', addWaveform);

function inputSelectChange() {
    midiCommunicator.setSelectedInput(midiInputSelectElem.value);
}

function volumeChange(this: HTMLInputElement) {
    //soundGenerator.setVolume(Number(volumeElem.value));
}

function waveformChange(this: HTMLSelectElement) {
    soundGenerator.setWaveType(this.value as OscillatorType);
}

function resumeAudioContext() {
    audioContext.resume().then(() => {
        console.log('Audio context resumed successfully');
        
        window.removeEventListener('click', resumeAudioContext);
    });
}

function addWaveform() {
    waveformsDivElem.appendChild(createWaveformSelector(waveformsDivElem.childElementCount));
}

function removeWaveform(this: HTMLButtonElement) {
    waveformsDivElem.removeChild(this.parentNode as Node);
}

function createWaveformSelector(id: number): HTMLDivElement {
    let selectorDiv = document.createElement('div');
    selectorDiv.id = id.toString();

    let selector = document.createElement('select');
    addWaveforms(selector);
    selector.addEventListener('change', waveformChange);

    let volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.value = '0.5';
    volumeSlider.addEventListener('change', volumeChange);

    let removeBtn = document.createElement('button');
    removeBtn.appendChild(document.createTextNode('remove'));
    removeBtn.addEventListener('click', removeWaveform);
    
    selectorDiv.appendChild(selector);
    selectorDiv.appendChild(volumeSlider);
    selectorDiv.appendChild(removeBtn);

    return selectorDiv;
}

function addWaveforms(selector: HTMLSelectElement) {
    let waveforms = ['square',
        'sawtooth',
        'triangle',
        'sine']

    for (let waveform of waveforms) {
        let option = document.createElement('option');
        option.text = waveform;
        option.value = waveform;
        selector.add(option);
    }
}