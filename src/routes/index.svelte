<svelte:head>
    <title>MPC 2021 Dance Tempo</title>
</svelte:head>

<script>
    import Sequencer from "$lib/Sequencer.svelte";
    import Confirm from "$lib/Confirm.svelte";
    import Modal from "svelte-simple-modal";
    import {page} from '$app/stores';
    import {STRINGS} from "../constants";

    const pattern = $page.query.get('p');
</script>

<main class="max-w-prose flex flex-col items-center justify-center h-screen">
    <p class="my-4 text-center">{@html STRINGS.INSTRUCTIONS}</p>

    <Sequencer pattern={Number(pattern) || 1}/>

    <Modal>
        <Confirm/>
    </Modal>
</main>
