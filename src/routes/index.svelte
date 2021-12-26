<svelte:head>
    <title>MPC 2021 Dance Tempo</title>
</svelte:head>

<script>
    /* global __VERSION__ */
    import Sequencer from "$lib/Sequencer.svelte";
    import Confirm from "$lib/Confirm.svelte";
    import Modal from "svelte-simple-modal";
    import {page} from '$app/stores';
    import {SEQUENCER_DEFAULT_PATTERN, STRINGS} from "../constants";
    import {onMount} from "svelte";

    const pattern = Number($page.query.get('p')) || SEQUENCER_DEFAULT_PATTERN;

    onMount(() => {
        console.log(`Sequencer v${__VERSION__}`);
    });
</script>

<main class="max-w-prose flex flex-col items-center justify-center h-screen">
    <p class="my-4 text-center">{@html STRINGS.INSTRUCTIONS}</p>

    <Sequencer {pattern}/>

    <Modal>
        <Confirm/>
    </Modal>
</main>
