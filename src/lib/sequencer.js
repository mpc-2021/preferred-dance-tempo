import { assets } from '$app/paths';

export const fetchSamples = (audioContext) => {
    const samples = new Map;

    ['kick']
        .forEach(async f => {
            // SvelteKit magically knows to find the sample in the static dir...
            // const response = await fetch(`${assets}/samples/${f}.wav`);
            const response = await fetch(`samples/${f}.wav`);
            const arrayBuffer = await response.arrayBuffer();
            // Safari needs the success callback.
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer, success => {
            }, error => {
                debugger;
            });
            samples.set(f, audioBuffer);
        });

    return samples;
};

export const playSample = (audioContext, audioBuffer) => {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    // sampleSource.playbackRate.value = playbackRate;
    sampleSource.connect(audioContext.destination)
    sampleSource.start();
    return sampleSource;
};
