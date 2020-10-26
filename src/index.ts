import MIDI_Communicator from './MIDI_Communicator';
import SoundGenerator from './SoundGenerator';

const midiInputSelectElem = document.getElementById('MIDI_Input_sel') as HTMLSelectElement;
const volumeElem = document.getElementById('volume') as HTMLInputElement;
const waveformSelectElem = document.getElementById('waveform_sel') as HTMLSelectElement;

const audioContext = new window.AudioContext();
const soundGenerator = new SoundGenerator(audioContext);
soundGenerator.setVolume(Number(volumeElem.value));
soundGenerator.setWaveType(waveformSelectElem.value as OscillatorType);
waveformSelectElem.addEventListener('change', waveformChange);

window.addEventListener('click', resumeAudioContext);

const midiCommunicator = new MIDI_Communicator();
midiCommunicator.init(midiInputSelectElem);
midiCommunicator.connectSoundGenerator(soundGenerator);

midiInputSelectElem.addEventListener('change', inputSelectChange);

volumeElem.addEventListener('change', volumeChange);

function inputSelectChange(e: Event) {
    midiCommunicator.setSelectedInput(midiInputSelectElem.value);
}

function volumeChange(e: Event) {
    soundGenerator.setVolume(Number(volumeElem.value));
}

function waveformChange(e: Event) {
    soundGenerator.setWaveType(waveformSelectElem.value as OscillatorType);
}

function resumeAudioContext(e: MouseEvent) {
    audioContext.resume().then(() => {
        console.log('Audio context resumed successfully');
        
        window.removeEventListener('click', resumeAudioContext);
    });
}