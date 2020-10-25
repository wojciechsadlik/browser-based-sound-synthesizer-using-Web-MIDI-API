import MIDI_Communicator from './MIDI_Communicator';

const midiInputSelectElem = document.getElementById('MIDI_Input_sel') as HTMLSelectElement;

const midiCommunicator = new MIDI_Communicator();

midiCommunicator.init(midiInputSelectElem);

midiInputSelectElem.addEventListener('change', inputSelectChange);

function inputSelectChange(e: Event) {
    midiCommunicator.setSelectedInput(midiInputSelectElem.value);
}