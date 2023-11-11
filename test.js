function updateGain(bandArray, bandToUpdate, newGain) {
    const index = bandArray.findIndex(band => band.band === bandToUpdate);

    if (index !== -1) {
        // If the band is found in the array, update its gain
        bandArray[index].gain = newGain;
    } else {
        // If the band is not found, you can handle it accordingly
        console.error(`Band ${bandToUpdate} not found in the array.`);
    }

    return bandArray;
}

// Example usage:
let defBand = [
    { band: 0, gain: 0 },
    { band: 1, gain: 0 },
    { band: 2, gain: 0 },
    { band: 3, gain: 0 },
    { band: 4, gain: 0 },
    { band: 5, gain: 0 },
    { band: 6, gain: 0 },
    { band: 7, gain: 0 },
    { band: 8, gain: 0 },
    { band: 9, gain: 0 },
    { band: 10, gain: 0 },
    { band: 11, gain: 0 },
    { band: 12, gain: 0 },
    { band: 13, gain: 0 },
]

// Update the gain of band 5 to a new value, e.g., 10
const updatedBandArray = updateGain(defBand, 50, 10);

console.log(updatedBandArray);
