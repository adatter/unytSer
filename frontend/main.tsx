import { ListEntry } from "./ListEntry.tsx";
import { items } from "../backend/data.ts";

const wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&search="

function generateUniqueId() {
	return Date.now().toString(36);
  }
  

function generateSeasons(num) {
	return Array(num).fill(false)
}


function addMovie(data, method="manually") {

	console.log(data);

	currentTitle.val = data.Title;
	currentGenre.val = data.Genre;
	// currentYearFrom.val = 0;
	// currentYearTo.val = 0;
	// currentRuntimeFrom.val = 0;
	// currentRuntimeTo.val = 0;
	currentCountry.val = data.Country;
	currentLanguage.val = data.Language;
	currentTotal.val = Number(data.totalSeasons);

	currentImg.val = data.Poster;

	console.log(currentTitle)

	modalAddVisible.val = true;


}


function search() {

	console.log("search btn", searchTitle.val)

    let titleRef = searchTitle.val
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


async function fetchHtml(url) {
    fetch(`http://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=${name}&rvsection=0`)
    .then(resp => resp.json())
    .then(data => {

        let pageId = Object.keys(data.query.pages)[0]

        if (data.query.pages[pageId].revisions) {
            console.log(data)
        } else { console.log("page not found") }   
    })
}

async function getWikiLink(t) {
	let title = "hannibal";
	console.log("get wiki link triggered for " + title);

	if (title) {
		try {
			let response = await fetch(`http://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=${title}&rvsection=0`);
			let data = await response.json();

			console.log("got data")
			console.log(data.query.pages)

			
		} catch (error) {
			console.error("Error fetching wiki link: ", error);
			return 0;
		}
	}
}

async function searchNewSeasons(t) {
    // let link = await getWikiLink(t);
    // console.log("got link: " + link);

    // if (link) {
    //     let html = await fetchHtml(link);
    //     console.log("Fetched HTML:", html);
    // }

	let title="hannibal"

	if (title) {
		try {
			let response = await fetch(`http://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=${title}&rvsection=0`);
			let data = await response.json();

			let wikiPageText = data.query.pages[Object.keys(data.query.pages)[0]].revisions[0]

			console.log("got data")
			console.log(wikiPageText)

			return wikiPageText

		} catch (error) {
			console.error("Error fetching wiki link: ", error);
			return 0;
		}
	}

}


const searchTitle = $$("");

let currentTitle = $$("");
let currentGenre = $$("");
let currentYearFrom = $$("");
let currentYearTo = $$("");
let currentRuntimeFrom = $$("");
let currentRuntimeTo = $$("");
let currentCountry = $$("");
let currentLanguage = $$("");
let currentTotal = $$(0);
let currentFinished = $$(false);
let currentImg = $$("");

const editTitle = $$("");
const editGenre = $$("");
const editYearFrom = $$("");
const editYearTo = $$("");
const editRuntimeFrom = $$("");
const editRuntimeTo = $$("");
const editCountry = $$("");
const editLanguage = $$("");
const editTotal = $$(0);
const editFinished = $$(false);

const modalAddVisible = $$(false);
const modalEditVisible = $$(false);

const infoModalVisible = $$(false);


export default
	<div id="main">
		<h1>List</h1>
		<hr />

		<fieldset>
			<legend>Serch for new entries</legend>
			<input type="text" placeholder="Enter Title Here" value={ searchTitle }></input>

			<button onclick={ search }>Search</button>

			<button onclick={ () => modalAddVisible.val = true }>Add Entry Manually</button>
		</fieldset>

		<fieldset>
			<legend>Search for new seasons</legend>

			{ editTitle }

			<button onclick={ searchNewSeasons }>Include All</button>
		</fieldset>
		
		{ items.$.map(item => <ListEntry { ...item.$ }></ListEntry>) }

		<div id="add-item-modal" class={  { visible: modalAddVisible }  }>
			<fieldset>
				<legend>Add entry</legend>
				
				<h3><input type="text" placeholder="Title" value={ currentTitle } /></h3>
				<img scr={ currentImg } alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img>

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


		<button onclick={ () => modalEditVisible.val = true }>Edit Entry</button>
		

	</div>