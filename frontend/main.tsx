import { useItems, storeItem, filterItems, deleteEntry } from "../backend/data.ts";

import { ListEntry } from "../common/components/ListEntry.tsx";
import { FormCheckComponent } from "../common/components/FormCheckComponent.tsx";
import { ModalNotFound } from "../common/modals/ModalNotFound.tsx";
import { UpdateSeasonsModal } from "../common/modals/UpdateSeasonsModal.tsx";

import { AuthIcon } from "auth/AuthIcon.tsx";

import InputGroupComponent from "../common/components/InputGroupSm.tsx";

import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"

const wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&search="

const noNewSeasonsFound = $$(false);
const searchingSeasons = $$(false);
const onlyUnchecked = $$(false);

const items = await useItems();

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

function addMovie(data: MovieData) : void {

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

	try {
		const match = data.Year.match(/(\d{4})/);
		const matchDash = data.Year.match(/(\d{4})([-–—])/);
		const matchDouble = data.Year.match(/(\d{4})–(\d{4})/);

		console.log(data.Year)

		if (matchDouble) {
			currentYearFrom.val = parseInt(matchDouble[1], 10);
			currentYearTo.val = parseInt(matchDouble[2], 10);
		} else if (matchDash) {
			currentYearFrom.val = parseInt(matchDash[1], 10);
			currentYearTo.val = 0;
		} else if (match) {
			currentYearFrom.val = parseInt(match[1], 10);
			currentYearTo.val = parseInt(match[1], 10);
		}
	} catch (error) {
		currentYearFrom.val = 0;
		currentYearTo.val = 0;
	}

	currentFinished.val = !!(currentYearTo.val);

	console.log(currentFinished.val, currentYearTo.val);

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
    console.log("search btn", searchTitle.val);

    const titleRef = searchTitle.val;
    let url = `http://www.omdbapi.com/?t=${titleRef}&apikey=a5145305`;

    if (titleRef.length <= 0) {
        console.log("Enter title");
        alert("Please Enter Title");
    } else {
        try {
            fetch(url)
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.Response == "False") {
						console.log("data response false");
						new bootstrap.Modal(document.getElementById('modalNotFound'), {}).toggle();
                    } else {
                        if (data.Type != "series") {
							try {
                            	url = `http://www.omdbapi.com/?t=${titleRef}&type=series&apikey=${key}`;
                                fetch(url)
                                    .then((resp) => resp.json())
                                    .then((dataNew) => { addMovie(dataNew); });
                            } catch (error) {
								console.log(error);
                                new bootstrap.Modal(document.getElementById('modalNotFound'), {}).toggle();
                            }
                        } else {
                            addMovie(data);
                        }
                    }
                });
        } catch (error) {
			console.log(error);
            new bootstrap.Modal(document.getElementById('modalNotFound'), {}).toggle();
        }
    }
}

function addItem() {
    storeItem({
        id: Date.now().toString(36),
        title: currentTitle.val,
        genre: currentGenre.val,
        year_from: currentYearFrom.val,
        year_to: currentYearTo.val,
        runtime: currentRuntime.val,
        country: currentCountry.val,
        language: currentLanguage.val,
        total_seasons: currentTotal.val,
        seasons: Array(currentTotal.val).fill(false),
        mark: "⚪",
        finished: !!(currentYearTo.val),
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
	const button = document.getElementById('addManuallyCloseBtn');
        if (button) {
            button.click();
        }

	currentTitle.val = ""
}

function startLoopSeasonsUpdate() {
	searchingSeasons.val = true;
	noNewSeasonsFound.val = false;
	while (newSeasonsArray.length) { newSeasonsArray.pop() };

	loopSeasonsUpdate().then(() => {
		newSeasonsArray.length ? {} : noNewSeasonsFound.val = true;
		searchingSeasons.val = false;
	})
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
            }, index * 500);
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

            updateSeasonsNumber(titleRef, title, seasonsOld);
        } catch (error) {
            console.error("Failed to fetch or process data: ", error);
        }
    }
}

async function updateSeasonsNumber(titleRef: string, title: string, seasonsOld: number) : Promise<void> {
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
				newSeasonsArray.push({title: titleRef, number: totalSeasons - seasonsOld});
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
const currentRated = $$("");
const currentRatings = $$([]);
const currentWriter = $$("");

const modalAddVisible = $$(false);
const modalFilterVisible = $$(false);

const newSeasonsArray = $$([]);

const updateSeasonsPercentage = $$("1%");
const updateSeasonsBarVisible = $$(false);

const checkedVar = $$(true);

const FilterMark = $$([]);

const filter = $$({
	mark: [],
	genre: [],
	language: [],
	country: [],
	director: [],
	writer: [],
	total: [],
	runtime: [],
	year: [],
	finished: [],
	completed: [],
});


items.$.map(item => item.$.total_seasons.observe((newSeasonsNum: number) => {
	if (newSeasonsNum) {
		const difference = item.total_seasons - item.seasons.length;

		if (difference < 0) {
			for (let i = 0; i < -difference; i++) {
				item.seasons.pop();
			}
		} else {
			for (let i = 0; i < difference; i++) {
				item.seasons.push(false);
			}
		}
	}
}))


function handleFilterClick(g: string) {
	if (filterMark.includes(g.val)) {
		filterMark = filterMark.filter(it => it.val != g.val)
	} else {
		filterMark.push(g.val)
	}
}

const searchInputField = document.getElementById("searchInputField")
if (searchInputField) {
	searchInputField.addEventListener("keypress", (event) => {
		console.log(event, "clicked")
		if (event.key === "Enter") {
			console.log("enter clicked")
			event.preventDefault();
			search()
		}
	})
}

export default
	<div id="main" class="container-fluid">	
		<div class="row">
			<div class="col-2 col-lg-1">
				<fieldset>
					<legend>Log in</legend>
					<AuthIcon />
				</fieldset>
			</div>
			<div class="col-10 col-lg-7">
				<h3 class="display-5">ADD SOMETHING NEW</h3>
				<div class="input-group mb-3">
					<input type="text" 
							class="form-control" 
							placeholder="Enter Title Here"
							id="searchInputField"
							value={ searchTitle }
							onkeydown={ (e) => e.code == "Enter" ? search() : {} }/>
					<button class="btn btn-outline-secondary" 
							type="button"
							onclick={ search }>
								Search</button>
				</div>
				<div class="or-div">
					<h5 class="display-4">OR</h5>	
					<div class="btn-group mr-2" role="group" aria-label="First group">
						<button type="button" 
							class="btn btn-info" 
							data-bs-toggle="modal" 
							data-bs-target="#addManuallyModal"
							id="addManuallyButton">
								Add Entry Manually
						</button>
						<button type="button" 
							class="btn btn-info" 
							data-bs-toggle="modal" 
							data-bs-target="#updateSeasonsModal"
							id="updateSeasonsButton"
							onclick={ startLoopSeasonsUpdate }>
								Check New Seasons
						</button>
					</div>
				</div>
				<h3 class="display-5">MY LIST</h3>
				<div class="btn-group mr-2" role="group" aria-label="First group">
					<button class="btn btn-primary" 
							type="button" 
							data-bs-toggle="collapse" 
							data-bs-target="#collapseFilter" 
							aria-expanded="false" 
							aria-controls="collapseFilter"
							onclick={ filterEntries }>
								Filter
					</button>
					<button class="btn btn-primary" 
							type="button" 
							data-bs-toggle="collapse" 
							data-bs-target="#collapseSort" 
							aria-expanded="false" 
							aria-controls="collapseSort" >
								Sort
					</button>
				</div>
				<div class="collapse" id="collapseFilter">
					<div class="card card-body">
						<input type="checkbox" checked={ onlyUnchecked } /> Unchecked only
							<b>Mark: </b> { [...new Set(items.$.map(item => item.mark)
													.flatMap(str => str.split(', ')))]
													.map(g => <FormCheckComponent str={g} func={ handleFilterClick } checked={checkedVar}/>) }
							<b>Genre: </b> { [...new Set(items.$.map(item => item.genre)
													.flatMap(str => str.split(', ')))]
													.map(g => <FormCheckComponent str={g} />) }
							<b>Language: </b> { [...new Set(items.$.map(item => item.language)
													.flatMap(str => str.split(', ')))]
													.map(g => <FormCheckComponent str={g} />) }
							<b>Country: </b> { [...new Set(items.$.map(item => item.country)
													.flatMap(str => str.split(', ')))]
													.map(g => <FormCheckComponent str={g} />) }
							<b>Director: </b> { [...new Set(items.$.map(item => item.director)
													.flatMap(str => str.split(', ')))]
													.map(g => <FormCheckComponent str={g} />) }
							<b>Writer: </b> { [...new Set(items.$.map(item => item.writer)
													.flatMap(str => str.split(', ')))]
													.map(g => <FormCheckComponent str={g} />) }
							<b>Finished: </b> <FormCheckComponent str="yes" />	
							<b>Number Seasons: </b> TODO
							<b>Year: </b> TODO															
					</div>
				</div>
				<div class="collapse" id="collapseSort">
					<div class="card card-body">
							TO DO
					</div>
				</div>
				<hr />
			</div>
			<div class="col-12 col-lg-8">
				<ul class="list-group">
					{ items.$.map(item => <ListEntry { ...item.$ } deleteEntry={ (i) => deleteEntry(i) }></ListEntry>) }
				</ul>
			</div>
		</div>
		<div id="modal div">
			<div id="addManuallyModal" 
				class="modal fade" 
				tabindex="-1" 
				role="dialog"
				onkeydown={ (e) => e.code == "Enter" ? addItem() : {} }>
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
								
							<InputGroupComponent for="Poster URL" type="url" value={currentImg} />
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
							<button type="button" 
									class="btn btn-secondary" 
									data-bs-dismiss="modal"
									id="addManuallyCloseBtn">
										Cancel
							</button>
							<button type="button" 
									onclick={ addItem } 
									class="btn btn-primary" 
									data-bs-dismiss="modal">
										Add Entry
							</button>
						</div>
					</div>
				</div>
			</div>

			<ModalNotFound func={ addMovie } />

			<UpdateSeasonsModal searchingSeasons={searchingSeasons} 
								currentTitle={currentTitle} 
								updateSeasonsBarVisible={updateSeasonsBarVisible} 
								updateSeasonsPercentage={updateSeasonsPercentage} 
								noNewSeasonsFound={noNewSeasonsFound} 
								newSeasonsArray={newSeasonsArray} />
		</div>
	</div>

