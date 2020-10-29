import MIDI_Communicator from './MIDI_Communicator';
import SoundGenerator from './SoundGenerator';

const midiInputSelectElem = document.getElementById('MIDI_Input_sel') as HTMLSelectElement;
const volumeElem = document.getElementById('volume') as HTMLInputElement;
const addWaveformBtnElem = document.getElementById('add_waveform_btn') as HTMLButtonElement;
const waveformsDivElem = document.getElementById('waveforms') as HTMLDivElement;
// const waveformSelectElem = document.getElementById('waveform_sel') as HTMLSelectElement;

const audioContext = new window.AudioContext();
const soundGenerator = new SoundGenerator(audioContext);
soundGenerator.setVolume(Number(volumeElem.value));
// soundGenerator.setWaveType(waveformSelectElem.value as OscillatorType);
// waveformSelectElem.addEventListener('change', waveformChange);

window.addEventListener('click', resumeAudioContext);

const midiCommunicator = new MIDI_Communicator();
midiCommunicator.init(midiInputSelectElem);
midiCommunicator.connectSoundGenerator(soundGenerator);

midiInputSelectElem.addEventListener('change', inputSelectChange);

volumeElem.addEventListener('change', volumeChange);

addWaveformBtnElem.addEventListener('click', addWaveform);

function inputSelectChange() {
    midiCommunicator.setSelectedInput(midiInputSelectElem.value);
}

function volumeChange() {
    soundGenerator.setVolume(Number(volumeElem.value));
}

function waveformChange() {
    // soundGenerator.setWaveType(waveformSelectElem.value as OscillatorType);
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

    let selector = document.createElement('select');
    addWaveforms(selector);

    let removeBtn = document.createElement('button');
    removeBtn.appendChild(document.createTextNode('Remove'));
    removeBtn.addEventListener('click', removeWaveform);
    
    selectorDiv.appendChild(selector);
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