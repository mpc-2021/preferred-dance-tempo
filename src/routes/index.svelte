<svelte:head>
    <title>MPC 2021 💃🕺 Dance Tempo</title>
</svelte:head>

<script>
    import Sequencer from "$lib/Sequencer.svelte";
</script>

<main class="flex flex-col items-center justify-center h-screen space-y-4">
    <p>Drag the slider to set the tempo. Click <em>Play</em> to start the beat. Feel free to dance!</p>
<!--    <p>When you're happy (and when I've implemented the button) click <em>next</em> to continue.</p>-->

    <Sequencer/>
</main>
