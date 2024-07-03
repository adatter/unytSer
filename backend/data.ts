
import { Datex } from "unyt_core/mod.ts";
Datex.Runtime.OPTIONS.PROTECT_POINTERS = true; // Privatize pointers to their users




interface MovieData {
	Title: string,
	Actors: string,
	Awards: string,
	Country: string,
	Director: string,
	Genre: string,
	Language: string,
	Metascore: string,
	Plot: string,
	Poster: string,
	Rated: string,
	Ratings: string[],
	Runtime: string,
	Writer: string,
	Year: string,
	imdbID: string,
	imdbRating: string,
	imdbVotes: string,
	totalSeasons: string
}

// const users = $$({} as Record<string, Item[]>);

// export function useItems() {
// 	const user = datex.meta.caller.main.toString();

// 	if (!(user in users)) {
// 		console.log(`Creating databse entry for ${user}.`);
// 		users[user] = [
// 			{name: "Kwass", type: "Bottles", amount: 12, checked: false}
// 		];
// 	}

// 	const sorted = always(() => { // is always the sorted version of users[user]
// 		// out-of-place array sorting, returns a sorted array copy
// 		// with the original pointers/references inside
// 		return users[user].toSorted((a, b) => a.amount - b.amount)
// 	});

// 	return sorted; // unsorted version: "return users[user];"
// }

// export function storeItem(item: Item) {
// 	// push to the original database entry, not to the copied sorted array
// 	users[datex.meta.caller.main.toString()].push(item);
// }



export const items = eternalVar("items") ?? $$([
	{
		id: "0",
		title: "Hannibal",
		genre: "Crime, Drama, Horror",
		year_from: 2013,
		year_to: 2015, 
		runtime: 42,
		country: "United States",
		language: "English",
		total_seasons: 3,
		seasons: [true, true, true],
		mark: "f",
		finished: false,
	},
	{
		id: "1",
		title: "Supernatural",
		genre: "Fantasy, Drama, Horror",
		year_from: 2005,
		year_to: 2020, 
		runtime: 42,
		country: "United States",
		language: "English",
		total_seasons: 15,
		seasons: [true, true, false, true, true, true, true, true, false, false, false, false, false, false, false],
		mark: "f",
		finished: false,
	}
]);


