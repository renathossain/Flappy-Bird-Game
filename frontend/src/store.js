import { writable } from 'svelte/store';

export const user = writable(null);
export const registered = writable(false);
