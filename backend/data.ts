
import { Datex } from "unyt_core/mod.ts";
Datex.Runtime.OPTIONS.PROTECT_POINTERS = true;


type MovieData = {
    actors?: string,
    awards?: string,
    checked?: boolean,
    country?: string,
    director?: string,
    finished?: boolean,
    genre?: string,
    id: string,
    imdbID?: string,
    imdbRating?: string,
    imdbVotes?: string,
    language?: string,
    mark: string,
    metascore?: string,
    plot?: string,
    poster?: string,
    rated?: string,
    ratings?: string[],
    runtime?: number,
    seasons: boolean[],
    title: string,
    total_seasons: number,
    writer?: string,
    year_from?: number,
    year_to?: number,
}

const users = eternal ?? $$({} as Record<string, MovieData[]>);

export function useItems() {
	const user = datex.meta.caller.main.toString();

	if (!(user in users)) {
		console.log(`Creating database entry for ${user}.`);
		users[user] = eternal ?? $$([]);
	}

	const sorted = always(() => { // is always the sorted version of users[user]
		// out-of-place array sorting, returns a sorted array copy
		// with the original pointers/references inside
		return users[user].toSorted((a, b) => a.total_seasons - b.total_seasons)
	});
	return users[user]
}

export function storeItem(item: MovieData) {
	users[datex.meta.caller.main.toString()].push(item);
}

export function deleteEntry(id: string) {
	const user = datex.meta.caller.main.toString();
    const index = users[user].findIndex(movie => movie.id === id.val);
    users[user].splice(index, 1);    
}

export function filterItems(filt: string, props: string[]) {
    const user = datex.meta.caller.main.toString();

    const filtered = always(() => {
		return users[user]
	});

    return filtered

}