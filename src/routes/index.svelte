<svelte:head>
    <title>MPC 2021 💃🕺 Dance Tempo</title>
</svelte:head>

<script>
    import {fetchSamples, playSample} from '$lib/sequencer';
    import {onMount} from 'svelte';
    let audioContext;
    let samples;
    let tempo = 120 + Math.round(Math.random()*60);

    onMount(() =>{
        audioContext = window.AudioContext ? new AudioContext() : new webkitAudioContext();
        samples = fetchSamples(audioContext);
    })
</script>

<!--<h1>Welcome to SvelteKit</h1>-->
<!--<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>-->

<section class=controls-main>
    <label for=bpm>Tempo</label>
    <input name=bpm id=bpm type=range min=20 max=400 bind:value={tempo} step=1 />
    <button on:click={() => playSample(audioContext, samples.get('kick'))}>Play</button>
</section>
