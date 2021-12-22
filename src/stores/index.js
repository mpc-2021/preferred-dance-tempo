import {writable} from "svelte/store";

export const tempo = writable(120 + Math.round(Math.random() * 60));
export const isPlaying = writable(false);
