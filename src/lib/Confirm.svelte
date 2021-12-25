<script>
    import {hasConfirmed, tempo, hasPlayed} from "../stores";
    import Popup from "$lib/Popup.svelte";
    import {getContext} from "svelte";
    import {STRINGS} from "../constants";
    const {open} = getContext('simple-modal');

    const handleConfirm = () => {
        $hasConfirmed = true;
        open(Popup, {
            message: STRINGS.CONFIRMATION_MESSAGE,
            code: btoa($tempo.toString().padEnd(6))
        });
    };
</script>

<button class=my-4 on:click={handleConfirm} disabled={!$hasPlayed}>{@html STRINGS.CONFIRM_BUTTON_TEXT}</button>
