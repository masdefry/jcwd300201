export const encryptId = async (id: string, key: string) => {
    let keyLength = 32
    let encodedKey = new TextEncoder().encode(key)

    if (encodedKey.length < keyLength) {
        const padding = new Uint8Array(keyLength - encodedKey.length);
        encodedKey = new Uint8Array([...encodedKey, ...padding])
    } else if (encodedKey.length > keyLength) {
        encodedKey = encodedKey.slice(0, keyLength);
    }

    const encodedData = new TextEncoder().encode(id);

    const importedKey = await crypto.subtle.importKey("raw", encodedKey, { name: "AES-GCM" }, false, ["encrypt"]);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, importedKey, encodedData)

    const encryptedDataArray = new Uint8Array(encryptedData);
    const base64Data = btoa(String.fromCharCode(...encryptedDataArray));

    return base64Data;
};