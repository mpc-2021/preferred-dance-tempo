<script>
    import {hasConfirmed, tempo, hasPlayed} from "../stores";
    import Popup from "$lib/Popup.svelte";
    import {getContext} from "svelte";
    import {SEQUENCER_DEFAULT_PATTERN, STRINGS} from "../constants";
    const {open} = getContext('simple-modal');
    import {page} from '$app/stores';

    const pattern = Number($page.query.get('p')) || SEQUENCER_DEFAULT_PATTERN;

    const handleConfirm = () => {
        $hasConfirmed = true;
        open(Popup, {
            message: STRINGS.CONFIRMATION_MESSAGE,
            code: pattern === SEQUENCER_DEFAULT_PATTERN ? btoa('123456') : btoa($tempo.toString().padEnd(6))
        });
    };
</script>

<button class=my-4 on:click={handleConfirm} disabled={!$hasPlayed}>{@html STRINGS.CONFIRM_BUTTON_TEXT}</button>
