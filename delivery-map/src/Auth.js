import CryptoJS from 'crypto-js';

const secretKey = 'klfgdhsdgdfsgjldasfsdlgsdlikgsfdhgdfghj484887gdes';

export function encrypt(word) {
    return CryptoJS.AES.encrypt(word, secretKey).toString();
}

export function decrypt(ciphertext) {
    return CryptoJS.AES.decrypt(ciphertext, secretKey).toString(CryptoJS.enc.Utf8);
}

export async function verifyIfMachineIsAuthorazized() {
    let myVariables;
    let machineFingerprint;
    if (window.electronAPI) {
        myVariables = await window.electronAPI.loadSettings();
        machineFingerprint = await window.electronAPI.getFingerprint();

        if (decrypt(myVariables.pontoA) === machineFingerprint) {
            return true;
        } else {
            console.log('Unauthorized machine:', machineFingerprint);
            return false;
        }
    }
    return false;
}

export async function authorizeNewMachnine(password) {
    let myVariables;
    let machineFingerprint;
    if (window.electronAPI) {
        myVariables = await window.electronAPI.loadSettings();
        if (password === decrypt(myVariables.pontoB)) {
            machineFingerprint = await window.electronAPI.getFingerprint();
            myVariables.pontoA = encrypt(machineFingerprint);
            window.electronAPI.saveSettings(myVariables);
        }
    }
}