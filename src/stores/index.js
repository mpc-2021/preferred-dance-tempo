import {writable} from "svelte/store";
import {TEMPO_BPM} from "../constants";

export const tempo = writable(TEMPO_BPM.DEFAULT_CENTRE + Math.round(Math.random() * 50.));
export const isPlaying = writable(false);
export const hasPlayed = writable(false);
export const hasConfirmed = writable(false);
