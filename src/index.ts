import MIDI_Communicator from './MIDI_Communicator';
import SoundGenerator from './SoundGenerator';

const midiInputSelectElem = document.getElementById('MIDI_Input_sel') as HTMLSelectElement;
const volumeElem = document.getElementById('volume') as HTMLInputElement;

const midiCommunicator = new MIDI_Communicator();

const audioContext = new window.AudioContext();
const soundGenerator = new SoundGenerator(audioContext);
soundGenerator.setVolume(Number(volumeElem.value));
window.addEventListener('click', resumeAudioContext);

midiCommunicator.init(midiInputSelectElem);

midiInputSelectElem.addEventListener('change', inputSelectChange);

volumeElem.addEventListener('change', volumeChange);

soundGenerator.noteOn(48);

function inputSelectChange(e: Event) {
    midiCommunicator.setSelectedInput(midiInputSelectElem.value);
}

function volumeChange(e: Event) {
    soundGenerator.setVolume(Number(volumeElem.value));
}

function resumeAudioContext(e: MouseEvent) {
    audioContext.resume().then(() => {
        console.log('Audio context resumed successfully');
    });
    window.removeEventListener('click', resumeAudioContext);
    soundGenerator.noteOn(49);
}