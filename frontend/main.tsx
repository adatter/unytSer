import { ListEntry } from "./ListEntry.tsx";
import { items } from "../backend/data.ts";

const wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&search="

type MovieData = {
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function generateUniqueId() : string {
	return Date.now().toString(36);
}
  

function generateSeasons(num: number) : boolean[] {
	return Array(num).fill(false)
}


function addMovie(data: MovieData, method="manually") : void {

	console.log("addMovie function", "got data:", data);

	currentTitle.val = data.Title;
	currentGenre.val = data.Genre;
	// currentRuntimeFrom.val = 0;
	// currentRuntimeTo.val = 0;
	currentCountry.val = data.Country;
	currentLanguage.val = data.Language;
	currentTotal.val = Number(data.totalSeasons);

	currentImg.val = data.Poster;

	try {
		const match = data.Year.match(/(\d{4})/);
		const matchDouble = data.Year.match(/(\d{4})–(\d{4})/);

		if (matchDouble) {
			currentYearFrom.val = parseInt(matchDouble[1], 10);
			currentYearTo.val = parseInt(matchDouble[2], 10);
		} else if (match) {
			currentYearFrom.val = parseInt(match[1], 10);
			currentYearTo.val = parseInt(match[1], 10);
		}
	} catch (error) {
		currentYearFrom.val = 0;
		currentYearTo.val = 0;
	}

	// try {
	// 	let match = data.Runtime.match(/(\d+) min/);
	// 	if (match) {
	// 		currentRuntime.val = parseInt(match[1], 10);
	// 	} else {
	// 		currentRuntime.val = 0;
	// 	}
	// } catch (error) {
	// 	currentRuntime.val = 0;
	// }

	console.log("what now?")
	
	console.log(currentTitle)

	modalAddVisible.val = true;

	console.log(modalAddVisible.val)

}


function search() {

	console.log("search btn", searchTitle.val)

    const titleRef = searchTitle.val
    let url = `http://www.omdbapi.com/?t=${titleRef}&apikey=a5145305`

    if (titleRef.length <= 0) {
        console.log("Enter title")
    } else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.Response == "False") {
                    addMovie(titleRef, "manually")
                } else {
                    if (data.Type != "series") {
                        url = `http://www.omdbapi.com/?t=${titleRef}&type=series&apikey=${key}`
                        fetch(url)
                            .then((resp) => resp.json())
                            .then((dataNew) => { addMovie(dataNew, "data") })
                    } else { addMovie(data, "data") }  
                }          
            })
    } 
}


function editEntry() {

	console.log("edit", this.id)

	modalEditVisible.val = false;

}


function confirmEdit() {

	console.log("close");
	modalEditVisible.val = false;
	console.log(modalEditVisible.val)
}


function addItem() {	
	items.push({
		id: generateUniqueId(),
		title: currentTitle.val,
		genre: currentGenre.val,
		year_from: currentYearFrom.val,
		year_to: currentYearTo.val,
		runtime_from: currentRuntimeFrom.val,
		runtime_to: currentRuntimeTo.val,
		country: currentCountry.val,
		language: currentLanguage.val,
		total_seasons: currentTotal.val,
		seasons: generateSeasons(currentTotal.val),
		mark: "n",
		finished: currentFinished.val,
		checked: false,
	});

	modalAddVisible.val = false;
}


async function loopSeasonsUpdate() {
	modalUpdateSeasonsVisible.val = true;
    updateSeasonsBarVisible.val = true;

    const updatePromises = items.map((item, index) => 
        new Promise(resolve => {
            setTimeout(async () => {
                await updateTotalSeasons(item.title, item.total_seasons);
                
                currentTitle.val = item.title;
                updateSeasonsPercentage.val = String(100 * (index + 1) / items.length) + "%";
                
                resolve();
            }, index * 100);
        })
    );
    
    await Promise.all(updatePromises);

    currentTitle.val = "";
    updateSeasonsPercentage.val = "0%";
    updateSeasonsBarVisible.val = false;
}



async function updateTotalSeasons(titleRef: string, seasonsOld: number = 0) {
    if (titleRef && titleRef.length > 0) {
        try {
            const response = await fetch(wikiURL + titleRef);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            let link = data[3][0];

            if (data[1].some((elt: string) => elt.includes("TV"))) {
                link = data[3][data[1].findIndex((elt: string) => elt.includes("TV"))];
            }

            let title = titleRef;
            if (link && link.includes("/")) {
                title = link.split("/").pop();
            } else {
                console.error("Link is not defined: ", title, link);
            }

            updateSeasonsNumber(title, seasonsOld);
        } catch (error) {
            console.error("Failed to fetch or process data: ", error);
        }
    }
}

async function updateSeasonsNumber(title: string, seasonsOld: number) : Promise<void> {
	try {
        const response = await fetch(`http://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=${title}&rvsection=0`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

		const data = await response.json();
		const pageId = Object.keys(data.query.pages)[0];
		const page = data.query.pages[pageId].revisions?.[0];

		if (!page) {
            console.log("Page not found: ", title);
        }

		if (data.query.pages[pageId].revisions) {
			const page = data.query.pages[pageId].revisions[0];
			const text = JSON.stringify(page);

			const totalSeasons = extractSeasons(text);

			if (totalSeasons - seasonsOld) {
				newSeasonsArray.push({title: title, number: totalSeasons - seasonsOld});
			}
		} else {
			console.log("page not found: ", title)
		}	
	} catch (error) {
	console.error("Failed to fetch or process data: ", error);
	}
}

function extractSeasons(text: string): number {
	let totalSeasons = 0;

	if (text.includes("redirect") || text.includes("REDIRECT")) {
		const suggest = text.split("[[").slice(-1)[0].split("]]")[0]
		console.log("Did you mean", suggest)
	} else {
		if (text.includes("num_seasons")) {
			totalSeasons = text.split("num_seasons")[1].split("= ")[1]

			if (totalSeasons.includes("{{unbulleted list")) {
				totalSeasons = totalSeasons.split("| ")
											.filter((str: string) =>  /^\d+$/.test(str[0]))
											.map((elt: string) => elt.split(" ")[0])
											.reduce((a,b) => parseInt(a)+parseInt(b))
			} else {
				totalSeasons = parseInt(totalSeasons.split("\\n")[0])
			}

		} else if (text.includes("num_series")) {
			totalSeasons = parseInt(text.split("num_series")[1].split("= ")[1].split("\\n")[0])
		} else {
			totalSeasons = seasonsOld
		}
	}
	return totalSeasons
}

function filterEntries() {
	modalFilterVisible.val = true;
}


const searchTitle = $$("");

const currentTitle = $$("");
const currentGenre = $$("");
const currentYearFrom = $$(0);
const currentYearTo = $$(0);
const currentRuntimeFrom = $$(0);
const currentRuntimeTo = $$(0);
const currentCountry = $$("");
const currentLanguage = $$("");
const currentTotal = $$(0);
const currentFinished = $$(false);
const currentImg = $$("");

const editTitle = $$("");
const editGenre = $$("");
const editYearFrom = $$(0);
const editYearTo = $$(0);
const editRuntimeFrom = $$(0);
const editRuntimeTo = $$(0);
const editCountry = $$("");
const editLanguage = $$("");
const editTotal = $$(0);
const editFinished = $$(false);

const modalAddVisible = $$(false);
const modalEditVisible = $$(false);
const modalUpdateSeasonsVisible = $$(false);
const modalFilterVisible = $$(false);

const infoModalVisible = $$(false);

const newSeasonsArray = $$([]);

const updateSeasonsPercentage = $$("1%");
const updateSeasonsBarVisible = $$(false);


export default
	<div id="main">		
		<div class="column left-column">
			<fieldset>
				<legend>Serch for new entries</legend>
				<input type="text" placeholder="Enter Title Here" value={ searchTitle }></input>

				<button onclick={ search }>Search</button>

				<button onclick={ () => modalAddVisible.val = true }>Add Entry Manually</button>

				<button onclick={ () => modalUpdateSeasonsVisible.val = true }>Check new seasons</button>
			</fieldset>

			<button onclick={ filterEntries }>Filter</button>

			<div id="filter-entries-modal" class={ { visible: modalFilterVisible } }>
			<button onclick={ () => modalFilterVisible.val = false }>&times;</button>
				<fieldset>
					<legend>Filter by</legend>
					<select>
						<option>Genre</option>
						<option>Drama</option>
					</select>
					<select>
						<option>Country</option>
						<option>US</option>
					</select>
					</fieldset>
			</div>

			
		</div>
		<div class="column right-column">
			
			{ items.$.map(item => <ListEntry { ...item.$ }></ListEntry>) }

			<div id="add-item-modal" class={  { visible: modalAddVisible }  }>
			<button onclick={ () => modalAddVisible.val = false } class="close-btn">&times;</button>
				<fieldset>
					<legend>Add entry</legend>
					
					<h3><input type="text" placeholder="Title" value={ currentTitle } /></h3>
					<img src={ currentImg } alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img>

					<ul>
						<li>Total seasons <input type="number" placeholder="Total Seasones" value={ currentTotal } /></li>
						<li>Year <input type="number" placeholder="from" value={ currentYearFrom } /> <input type="number" placeholder="to" value={ currentYearTo } /></li>
						<li>Runtime <input type="number" placeholder="from" value={ currentRuntimeFrom } /> <input type="number" placeholder="to" value={ currentRuntimeTo } /></li>
						<li>Genre <input type="text" placeholder="Genre" value={ currentGenre } /></li>
						<li>Country <input type="text" placeholder="Country" value={ currentCountry } /></li>
						<li>Language <input type="text" placeholder="Language" value={ currentLanguage } /></li>
						<li>Finished <input type="checkbox" checked={ currentFinished } /></li>
					</ul>
				</fieldset>

				<button onclick={ addItem }>Add Entry</button>
			</div>

			<div id="update-seasons-modal" class={ { visible: modalUpdateSeasonsVisible } }>
				<button onclick={ () => modalUpdateSeasonsVisible.val = false }>&times;</button>
				<fieldset style="margin: 25px;">
					<legend>Search for New Seasons</legend>
					<p>Checking if there are new seasons for: <strong>{ currentTitle }</strong></p>

					<div id="myProgress" class={ { visible: updateSeasonsBarVisible } }>
					<div id="myBar" style={ { width: updateSeasonsPercentage } }></div>
					</div>

					<hr />

					<p>Possibly there are new seasons out for:</p>
					<ul>
					{ newSeasonsArray.$.map(item =>
						<li><strong>{ item.title }</strong>: new seasons: { item.number }</li>
					)}
					</ul>

					<hr />

					<button onclick={ loopSeasonsUpdate }>Include All</button>
				</fieldset>
			</div>


			<div id="edit-item-modal" class={ { visible: modalEditVisible } }>
				<fieldset>
					<legend>Edit entry</legend>
					
					<h3>{ editTitle }</h3>

					<input type="text" placeholder="Title" value={ editTitle } />
					<input type="number" placeholder="Total Seasones" value={ editTotal } />
					
					<ul>
						<li>Year <input type="number" placeholder="from" value={ editYearFrom } /> <input type="number" placeholder="to" value={ editYearTo } /></li>
						<li>Runtime <input type="number" placeholder="from" value={ editRuntimeFrom } /> <input type="number" placeholder="to" value={ editRuntimeTo } /></li>
						<li>Genre <input type="text" placeholder="Genre" value={ editGenre } /></li>
						<li>Country <input type="text" placeholder="Country" value={ editCountry } /></li>
						<li>Language <input type="text" placeholder="Language" value={ editLanguage } /></li>
						<li>Finished <input type="checkbox" checked={ editFinished } /></li>
					</ul>

				</fieldset>

				<button onclick={ confirmEdit }>Confirm Edit</button>
			</div>
		</div>

		


		
		

	</div>