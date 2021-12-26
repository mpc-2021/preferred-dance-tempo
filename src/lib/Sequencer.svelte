<svelte:window on:keydown={handleKeydown}/>

<script>
    export let pattern = 1;
    import {onMount} from "svelte";
    import {isPlaying, tempo, hasPlayed, hasConfirmed} from "../stores";
    import {SEQUENCER_MAX_STEPS, TEMPO_BPM} from "../constants";

    let audioContext, timerID, nextNoteTime = 0.0, currentNote = 0;
    const noteQueue = [];
    const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
    const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
    const sequence = {kick: [], snare: [], hat: []};
    const samples = new Map;

    if (pattern < 1 || pattern > 15) {
        pattern = 1;
    }

    onMount(() => {
        audioContext = window.AudioContext ? new AudioContext() : new webkitAudioContext();
        setupSamples();
        setupPattern();
    });

    const handleKeydown = (event) => {
        switch (event.key) {
            case ' ':
                $isPlaying ? stop() : play();
                break;
        }
    };

    const setupSamples = () => {
        Object.keys(sequence)
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

    // Read the sequencer pattern.
    const setupPattern = async () => {
        const response = await fetch(`patterns/${pattern}.txt`);
        const text = await response.text();

        text.split('\n').forEach(line => {
            let instrument;
            switch (line[0]) {
                case 'H':
                    instrument = 'hat';
                    break;
                case 'S':
                    instrument = 'snare';
                    break;
                case 'K':
                    instrument = 'kick';
                    break;
            }
            [...line].forEach(char => {
                if (['x', 'o'].includes(char)) {
                    sequence[instrument].push(true);
                } else if (char === '-') {
                    sequence[instrument].push(false);
                }
            })
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
        $hasPlayed = true;
        scheduler(); // kick off scheduling
        while (noteQueue.length && noteQueue[0].time < nextNoteTime) {
            // drawNote = notesInQueue[0].note;
            // remove note from queue
            noteQueue.shift();
        }
        // requestAnimationFrame(draw); // start the drawing loop.
    };

    // Holding onto this in case we decide we want to draw something during playback.
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

        // Play samples that are 'true' for this beat.
        if (sequence.kick[beatNumber]) {
            playSample(samples.get('kick'), time);
        }
        if (sequence.snare[beatNumber]) {
            playSample(samples.get('snare'), time);
        }
        if (sequence.hat[beatNumber]) {
            playSample(samples.get('hat'), time);
        }
        // Or...
        // Object.keys(sequence).forEach(k => sequence[k][beatNumber] && playSample(samples.get(k), time));
    }

    const nextNote = () => {
        const secondsPerBeat = (60.0 / $tempo) / 4.; // Semiquaver divisions

        nextNoteTime += secondsPerBeat; // Add beat length to last beat time

        // Advance the beat number, wrap to zero
        currentNote++;
        if (currentNote === SEQUENCER_MAX_STEPS) {
            currentNote = 0;
        }
    }

    const playSample = (audioBuffer, time) => {
        const sampleSource = audioContext.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.connect(audioContext.destination)
        sampleSource.start(time);
        return sampleSource;
    };

    $: {
        $hasConfirmed && stop();
        $hasConfirmed = false;
    }
</script>

<!--<label for=bpm>Tempo</label>-->
<input class="w-full my-4" name=bpm id=bpm type=range min={TEMPO_BPM.MIN} max={TEMPO_BPM.MAX} bind:value={$tempo} step=.1/>
{#if $isPlaying}
    <button class="my-4 w-24 bg-red-500 hover:bg-red-400 border-red-700 hover:border-red-500" on:click={stop}>Stop</button>
{:else}
    <button class="my-4 w-24 bg-green-500 hover:bg-green-400 border-green-700 hover:border-green-500" on:click={play}>Play
    </button>
{/if}
