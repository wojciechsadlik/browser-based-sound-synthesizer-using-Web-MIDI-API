import {NoteOnEvent, NoteOffEvent} from './CustomEvents';
import MIDICommunicator from './MIDICommunicator';
import KeyboardMIDIInput from './KeyboardMIDIInput';
import SoundGenerator from './SoundGenerator';
import Oscilloscope from './Oscilloscope';
import WaveformData from './WaveformData';

const midiInputSelectElem = document.getElementById('MIDI_Input_sel') as HTMLSelectElement;
const addWaveformBtnElem = document.getElementById('add_waveform_btn') as HTMLButtonElement;
const waveformsTableElem = document.getElementById('waveforms') as HTMLTableElement;
const dynamicKeyboardCheckElem = document.getElementById('dynamicKeyboardToggle') as HTMLInputElement;
const masterVolumeElem = document.getElementById('masterVolume') as HTMLInputElement;
const compressorCheckElem = document.getElementById('compressorToggle') as HTMLInputElement;
const oscilloscopeCheckElem = document.getElementById('oscilloscopeToggle') as HTMLInputElement;
const oscilloscopeCanvasElem = document.getElementById('oscilloscopeCanvas') as HTMLCanvasElement;

const audioContext = new window.AudioContext();
const soundGenerator = new SoundGenerator(audioContext);
const oscilloscope = new Oscilloscope(audioContext, oscilloscopeCanvasElem);

const midiCommunicator = new MIDICommunicator();
midiCommunicator.init(midiInputSelectElem);

midiCommunicator.addEventListener('noteOn', noteOn as EventListener);

midiCommunicator.addEventListener('noteOff', noteOff as EventListener);

const keyboardMidiInput = new KeyboardMIDIInput();
keyboardMidiInput.addEventListener('noteOn', noteOn as EventListener);
keyboardMidiInput.addEventListener('noteOff', noteOff as EventListener);

window.addEventListener('click', resumeAudioContext);

midiInputSelectElem.addEventListener('change', inputSelectChange);

addWaveformBtnElem.addEventListener('click', addWaveform);

masterVolumeElem.addEventListener('change', volumeChange);

compressorCheckElem.addEventListener('change', compressorCheckChange);

oscilloscopeCheckElem.addEventListener('change', oscillatorCheckChange);

function noteOn(e: NoteOnEvent) {
    let velocity = 1;
    if (dynamicKeyboardCheckElem.checked)
        velocity = e.velocity / 125;
    
    soundGenerator.noteOn(e.noteNumber, velocity);
    oscilloscope.setFrequency(SoundGenerator.noteNumberToFrequency(e.noteNumber));
}

function noteOff(e: NoteOffEvent) {
    soundGenerator.noteOff(e.noteNumber);
}

function oscillatorCheckChange(this: HTMLInputElement) {
    if (this.checked) {
        oscilloscopeStart();
    } else {
        oscilloscopeStop();
    }
}

function oscilloscopeStop() {
    oscilloscope.drawStop();
    oscilloscope.disconnect();
    soundGenerator.setDestination(audioContext.destination);
    oscilloscopeCanvasElem.hidden = true;
}

function oscilloscopeStart() {
    soundGenerator.setDestination(oscilloscope.analyser);
    oscilloscope.setDestination();
    oscilloscope.drawStart();
    oscilloscopeCanvasElem.hidden = false;
}

function inputSelectChange() {
    midiCommunicator.setSelectedInput(midiInputSelectElem.value);
}

function volumeChange(this: HTMLInputElement) {
    if (this.id === 'masterVolume')
        soundGenerator.setMasterVolume(Number(this.value));
    else {
        let rowId = this.parentElement!.parentElement!.id
        soundGenerator.setVolume(Number(rowId), Number(this.value));
    }
}

function delayChange(this: HTMLInputElement) {
    let rowId = this.parentElement!.parentElement!.id
    soundGenerator.setDelay(Number(rowId), Number(this.value));
}

function waveformChange(this: HTMLSelectElement) {
    let rowId = this.parentElement!.parentElement!.id
    soundGenerator.setWaveType(Number(rowId), this.value as OscillatorType);
}

function compressorCheckChange(this: HTMLInputElement) {
    soundGenerator.setCompressorOn(this.checked);
}

function resumeAudioContext() {
    audioContext.resume().then(() => {
        console.log('Audio context resumed successfully');
        
        window.removeEventListener('click', resumeAudioContext);
    });
}

function addWaveform() {
    let lastChild = waveformsTableElem.lastElementChild;
    let id = ((lastChild) ? Number(lastChild.id) + 1 : 0);
    let waveformSelector = createWaveformSelector(id);
    waveformsTableElem.appendChild(waveformSelector);
    let waveform: WaveformData = {type: 'square', volume: 0.5, delay: 0.0};
    soundGenerator.addWaveform(Number(waveformSelector.id), waveform);
}

function removeWaveform(this: HTMLButtonElement) {
    let row = this.parentElement!.parentElement!

    soundGenerator.removeWaveform(Number(row.id));
    waveformsTableElem.removeChild(row as Node);
}

function createWaveformSelector(id: number): HTMLTableRowElement {
    let tableRow = document.createElement('tr');
    tableRow.id = id.toString();

    let wavetype = document.createElement('td');
    let selector = document.createElement('select');
    addWaveforms(selector);
    selector.addEventListener('change', waveformChange);
    wavetype.append(selector);

    let volume = document.createElement('td');
    let volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.value = '0.5';
    volumeSlider.addEventListener('change', volumeChange);
    volume.append(volumeSlider);

    let delay = document.createElement('td');
    let delaySlider = document.createElement('input');
    delaySlider.type = 'range';
    delaySlider.min = '0';
    delaySlider.max = '1';
    delaySlider.step = '0.01';
    delaySlider.value = '0';
    delaySlider.addEventListener('change', delayChange);
    delay.append(delaySlider);

    let remove = document.createElement('td');
    let removeBtn = document.createElement('button');
    removeBtn.appendChild(document.createTextNode('remove'));
    removeBtn.addEventListener('click', removeWaveform);
    remove.append(removeBtn);

    tableRow.appendChild(wavetype);
    tableRow.appendChild(volume);
    tableRow.appendChild(delay);
    tableRow.appendChild(remove);

    return tableRow;
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