<script>
    import {onMount} from "svelte";
    import {isPlaying, tempo} from "../stores";

    let audioContext, timerID, nextNoteTime = 0.0, currentNote = 0, noteQueue = [];
    const samples = new Map;
    const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
    const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

    onMount(() => {
        audioContext = window.AudioContext ? new AudioContext() : new webkitAudioContext();
        setupSamples();
    });

    const setupSamples = () => {
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
    };

    const stop = () => {
        window.clearTimeout(timerID);
        $isPlaying = false;
    };

    const play = () => {
        // check if context is in suspended state (autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        currentNote = 0;
        nextNoteTime = audioContext.currentTime;
        $isPlaying = true;
        scheduler(); // kick off scheduling
        while (noteQueue.length && noteQueue[0].time < nextNoteTime) {
            // drawNote = notesInQueue[0].note;
            noteQueue.shift();   // remove note from queue
        }
        // requestAnimationFrame(draw); // start the drawing loop.
    };

    // const draw = () => {
    //     // let drawNote = lastNoteDrawn;
    //     const currentTime = audioContext.currentTime;
    //
    //     while (noteQueue.length && noteQueue[0].time < currentTime) {
    //         // drawNote = notesInQueue[0].note;
    //         noteQueue.splice(0, 1);   // remove note from queue
    //     }
    //
    //     // // We only need to draw if the note has moved.
    //     // if (lastNoteDrawn !== drawNote) {
    //     //     pads.forEach(el => {
    //     //         el.children[lastNoteDrawn].style.borderColor = 'hsla(0, 0%, 10%, 1)';
    //     //         el.children[drawNote].style.borderColor = 'hsla(49, 99%, 50%, 1)';
    //     //     });
    //     //
    //     //     lastNoteDrawn = drawNote;
    //     // }
    //     // set up to draw again
    //     requestAnimationFrame(draw);
    // }

    const scheduler = () => {
        // while there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
            scheduleNote(currentNote, nextNoteTime);
            nextNote();
        }
        timerID = window.setTimeout(scheduler, lookahead);
    }

    const scheduleNote = (beatNumber, time) => {
        // push the note on the queue, even if we're not playing.
        noteQueue.push({note: beatNumber, time: time});
        // console.log(beatNumber, time);

        playSample(samples.get('kick'), time);
    }

    const nextNote = () => {
        const secondsPerBeat = 60.0 / $tempo;

        nextNoteTime += secondsPerBeat; // Add beat length to last beat time

        // Advance the beat number, wrap to zero
        currentNote++;
        if (currentNote === 4) {
            currentNote = 0;
        }
    }

    const playSample = (audioBuffer, time) => {
        const sampleSource = audioContext.createBufferSource();
        sampleSource.buffer = audioBuffer;
        // sampleSource.playbackRate.value = playbackRate;
        sampleSource.connect(audioContext.destination)
        sampleSource.start(time);
        return sampleSource;
    };
</script>

<!--<label for=bpm>Tempo</label>-->
<input class="w-full" name=bpm id=bpm type=range min=20 max=300 bind:value={$tempo} step=.1/>
{#if $isPlaying}
    <button class="bg-red-500 hover:bg-red-400 border-red-700 hover:border-red-500" on:click={stop}>Stop</button>
{:else}
    <button class="bg-green-500 hover:bg-green-400 border-green-700 hover:border-green-500" on:click={play}>Play</button>
{/if}
