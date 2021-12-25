import {writable} from "svelte/store";

export const tempo = writable(120 + Math.round(Math.random() * 100));
export const isPlaying = writable(false);
export const hasPlayed = writable(false);
export const hasConfirmed = writable(false);
