<svelte:head>
    <title>MPC 2021 💃🕺 Dance Tempo</title>
</svelte:head>

<script>
    import {fetchSamples, playSample} from '$lib/sequencer';
    import {onMount} from 'svelte';

    let audioContext;
    let samples;
    let tempo = 120 + Math.round(Math.random() * 60);

    onMount(() => {
        audioContext = window.AudioContext ? new AudioContext() : new webkitAudioContext();
        samples = fetchSamples(audioContext);
    })
</script>

<main class="flex flex-col items-center justify-center h-screen space-y-4">
    <p>Drag the slider to set the tempo. Click <em>Play</em> to start the beat. Feel free to dance!</p>
    <p>When you're happy (and when I've implemented the button) click <em>next</em> to continue.</p>

    <section class=controls-main>
        <label for=bpm>Tempo</label>
        <input name=bpm id=bpm type=range min=20 max=400 bind:value={tempo} step=.1/>
        <button on:click={() => playSample(audioContext, samples.get('kick'))}>Play</button>
    </section>
</main>
