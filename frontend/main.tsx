import { ListEntry } from "./ListEntry.tsx";
import { items } from "../backend/data.ts";
import InputGroupComponent from "frontend/InputGroupSm.tsx";
import ModalBody from "frontend/ModalBody.tsx";

import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"

import { props } from "unyt_core/datex_short.ts";

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
	currentCountry.val = data.Country;
	currentLanguage.val = data.Language;
	currentTotal.val = Number(data.totalSeasons);

	currentActors.val = data.Actors;
	currentAwards.val = data.Awards;
	currentDirector.val = data.Director;
	currentImdbID.val = data.imdbID;
	currentImdbRating.val = data.imdbRating;
	currentImdbVotes.val = data.imdbVotes;
	currentMetascore.val = data.Metascore;
	currentPlot.val = data.Plot;
	currentRated.val = data.Rated;
	// currentRatings = data.Ratings;
	currentWriter.val = data.Writer;

	currentImg.val = data.Poster;

	currentFinished.val = $$(false);

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

	try {
		const matchRuntime = data.Runtime.match(/(\d+)\s*min/);
	
		if (matchRuntime) {
			currentRuntime.val = parseInt(matchRuntime[1], 10);
		} else {
			currentRuntime.val = 0;
		}
	} catch (error) {
		currentRuntime.val = 0;
	}


	const button = document.getElementById('addManuallyButton');
        if (button) {
            button.click();
        }

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



function addItem() {
    items.push({
        id: generateUniqueId(),
        title: currentTitle.val,
        genre: currentGenre.val,
        year_from: currentYearFrom.val,
        year_to: currentYearTo.val,
        runtime: currentRuntime.val,
        country: currentCountry.val,
        language: currentLanguage.val,
        total_seasons: currentTotal.val,
        seasons: generateSeasons(currentTotal.val),
        mark: "n",
        finished: currentFinished.val,
        checked: false,
        poster: currentImg.val,
        actors: currentActors.val,
        awards: currentAwards.val,
        director: currentDirector.val,
        imdbID: currentImdbID.val,
        imdbRating: currentImdbRating.val,
        imdbVotes: currentImdbVotes.val,
        metascore: currentMetascore.val,
        plot: currentPlot.val,
        rated: currentRated.val,
        ratings: currentRatings,
        writer: currentWriter.val,
    });

    modalAddVisible.val = false;
}



async function loopSeasonsUpdate() {
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

			const totalSeasons = extractSeasons(text, seasonsOld);

			if (totalSeasons - seasonsOld > 0) {
				newSeasonsArray.push({title: title, number: totalSeasons - seasonsOld});
			}
		} else {
			console.log("page not found: ", title)
		}	
	} catch (error) {
	console.error("Failed to fetch or process data: ", error);
	}
}

function extractSeasons(text: string, seasonsOld: number): number {
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

function filterEntries() : void {
	modalFilterVisible.val = true;

}



const searchTitle = $$("");

const currentTitle = $$("");
const currentGenre = $$("");
const currentYearFrom = $$(0);
const currentYearTo = $$(0);
const currentRuntime = $$(0);
const currentCountry = $$("");
const currentLanguage = $$("");
const currentTotal = $$(0);
const currentFinished = $$(false);
const currentImg = $$("");

const currentActors = $$("");
const currentAwards = $$("");
const currentDirector = $$("");
const currentImdbID = $$("");
const currentImdbRating = $$("");
const currentImdbVotes = $$("");
const currentMetascore = $$("");
const currentPlot = $$("");
const currentPoster = $$("");
const currentRated = $$("");
const currentRatings = $$([]);
const currentWriter = $$("");


const modalAddVisible = $$(false);
const modalUpdateSeasonsVisible = $$(false);
const modalFilterVisible = $$(false);

const infoModalVisible = $$(false);

const newSeasonsArray = $$([]);

const updateSeasonsPercentage = $$("1%");
const updateSeasonsBarVisible = $$(false);


export default
	<div id="main" class="container-fluid">	
		<div class="row">
			<div class="col-12">
				<div class="input-group mb-3">
					<input type="text" 
						class="form-control" 
						placeholder="Enter Title"
						aria-label="Enter Title" 
						aria-describedby="btn-search-addon" 
						value={ searchTitle }/>
					<div class="input-group-append">
						<button class="btn btn-outline-secondary" 
							type="button" 
							onclick={ search } 
							id="btn-search-addon">Search
						</button>
					</div>
					or 
					<div class="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
						<div class="btn-group mr-2" role="group" aria-label="First group">
							<button type="button" 
								class="btn btn-primary" 
								data-bs-toggle="modal" 
								data-bs-target="#addManuallyModal"
								id="addManuallyButton">
								Add Entry Manually
							</button>
							<button type="button" 
								class="btn btn-primary" 
								data-bs-toggle="modal" 
								data-bs-target="#updateSeasonsModal"
								id="updateSeasonsButton">
								Check New Seasons
							</button>
						</div>
					</div>
				</div>

				<p>
					<button class="btn btn-primary" 
						type="button" 
						data-bs-toggle="collapse" 
						data-bs-target="#collapseFilter" 
						aria-expanded="false" 
						aria-controls="collapseFilter">
						Filter
					</button>
					</p>
					<div class="collapse" id="collapseFilter">
					<div class="card card-body">
						TO DO
					</div>
					</div>
			</div>
		</div>

			
		<div class="column right-column">
			<ul class="list-group">
				{ items.$.map(item => <ListEntry { ...item.$ }> <button type="button" class="btn">delete</button> </ListEntry>) }
			</ul>

			{/* <div id="add-item-modal" class={  { visible: modalAddVisible }  }>
			<button onclick={ () => modalAddVisible.val = false } class="close-btn">&times;</button>
				<fieldset>
					<legend>Add entry</legend>
					
					<h3><input type="text" placeholder="Title" value={ currentTitle } /></h3>
					<img src={ currentImg } alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img>

					<ul>
						<li>Total seasons <input type="number" placeholder="Total Seasones" value={ currentTotal } /></li>
						<li>Year <input type="number" placeholder="from" value={ currentYearFrom } /> <input type="number" placeholder="to" value={ currentYearTo } /></li>
						<li>Runtime <input type="number" placeholder="from" value={ currentRuntime} /></li>
						<li>Genre <input type="text" placeholder="Genre" value={ currentGenre } /></li>
						<li>Country <input type="text" placeholder="Country" value={ currentCountry } /></li>
						<li>Language <input type="text" placeholder="Language" value={ currentLanguage } /></li>
						<li>Finished <input type="checkbox" checked={ currentFinished } /></li>
					</ul>
				</fieldset>

				<button onclick={ addItem }>Add Entry</button>
			</div> */}

			<div class="modal fade" 
				id="addManuallyModal" 
				tabindex="-1" 
				role="dialog" 
				aria-labelledby="addManuallyModalLabel" 
				aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="addManuallyModal">Add Entry</h5>
							<button type="button" 
								class="close" 
								data-bs-dismiss="modal" 
								aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<img src={ currentImg } alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img>
								<form>
									<div class="form-group">
										<label for="exampleFormControlFile1">Upload A Poster</label>
										<input type="file" class="form-control-file" id="exampleFormControlFile1" />
									</div>
								</form>

							<InputGroupComponent for="Title" type="text" value={currentTitle} />
							<InputGroupComponent for="Total Seasons" type="number" value={currentTotal} />
							<InputGroupComponent for="Year From" type="number" value={currentYearFrom} />
							<InputGroupComponent for="Year To" type="number" value={currentYearTo} />
							<InputGroupComponent for="Runtime" type="number" value={currentRuntime} />
							<InputGroupComponent for="Genre" type="text" value={currentGenre} />
							<InputGroupComponent for="Country" type="text" value={currentCountry} />
							<InputGroupComponent for="Language" type="text" value={currentLanguage} />

							<InputGroupComponent for="Actors" type="text" value={currentActors} />
							<InputGroupComponent for="Awards" type="text" value={currentAwards} />
							<InputGroupComponent for="Director" type="text" value={currentDirector} />
							<InputGroupComponent for="IMDB ID" type="text" value={currentImdbID} />
							<InputGroupComponent for="IMDB Rating" type="text" value={currentImdbRating} />
							<InputGroupComponent for="IMDB Votes" type="text" value={currentImdbVotes} />
							<InputGroupComponent for="Metascore" type="text" value={currentMetascore} />
							<InputGroupComponent for="Plot" type="text" value={currentPlot} />
							<InputGroupComponent for="Rated" type="text" value={currentRated} />
							<InputGroupComponent for="Writer" type="text" value={currentWriter} />

							<InputGroupComponent for="Finished" type="checkbox" value={currentFinished} />
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close
							</button>
							<button type="button" onclick={ addItem } class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
						</div>
					</div>
				</div>
			</div>

			<div class="modal fade" 
				id="updateSeasonsModal" 
				tabindex="-1" 
				role="dialog" 
				aria-labelledby="updateSeasonsModalLabel" 
				aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="upsateSeasonsModal">UpdateSeasons</h5>
							<button type="button" 
								class="close" 
								data-bs-dismiss="modal" 
								aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
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
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close
							</button>
							<button type="button" onclick={ addItem } class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
						</div>
					</div>
				</div>
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


		</div>

	</div>

