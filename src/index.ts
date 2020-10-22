import MIDI_Communicator from './MIDI_Communicator';

const midiInputSelectElem = document.getElementById('MIDI_Input_sel') as HTMLInputElement;

const midiCommunicator = new MIDI_Communicator();

midiCommunicator.requestAccess().then(
    () => {
        for (let input in midiCommunicator.getInputs()) {

        }
    }
);

