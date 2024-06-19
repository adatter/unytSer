import { ListEntry } from "./ListEntry.tsx";
import { SeasonsEntry } from "./SeasonsEntry.tsx";
import { items } from "../backend/data.ts";

let displayedItems = [...items]

function generateUniqueId() {
	return Date.now().toString(36);
  }
  

function generateSeasons(num) {
	return Array(num).fill(false)
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
		year: currentYear.val,
		runtime: currentRuntime.val,
		country: currentCountry.val,
		language: currentLanguage.val,
		total_seasons: currentTotal.val,
		seasons: generateSeasons(currentTotal.val),
		mark: "n",
		finished: false,
		checked: false,
	});

	modalAddVisible.val = false;
}


const currentTitle = $$("");
const currentGenre = $$("");
const currentYear = $$("");
const currentRuntime = $$("");
const currentCountry = $$("");
const currentLanguage = $$("");
const currentTotal = $$(0);

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


export default
	<div id="main">
		<h1>List</h1>
		<hr />
		
		{ items.$.map(item => <ListEntry {...item.$}></ListEntry> ) }

		<div id="add-item-modal" class={  { visible: modalAddVisible }  }>
			<fieldset>
				<legend>Add entry</legend>

				<input type="number" placeholder="Total Seasones" value={ currentTotal } />

				<input type="text" placeholder="Title" value={ currentTitle } />
			</fieldset>

			<button onclick={ addItem }>Add Entry</button>
		</div>

		<div id="edit-item-modal" class={ { visible: modalEditVisible } }>
			<fieldset>
				<legend>Edit entry</legend>
				Choose entry to edit
				<ul>
					{ items.map(item => <li><button href="#" id={ item.id } onclick={ editEntry }>{ item.title }</button></li>) }
				</ul>

				<input type="number" placeholder="Total Seasones" value={ editTotal } />

				<input type="text" placeholder="Title" value={ editTitle } />

				Year <input type="number" placeholder="from" value={ editYearFrom } /> <input type="number" placeholder="to" value={ editYearTo } />
				Runtime <input type="number" placeholder="from" value={ editRuntimeFrom } /> <input type="number" placeholder="to" value={ editRuntimeTo } />
				Genre <input type="text" placeholder="Genre" value={ editGenre } />
				Country <input type="text" placeholder="Country" value={ editCountry } />
				Language <input type="text" placeholder="Language" value={ editLanguage } />
				Finished <input type="checkbox" checked={ editFinished } />


			</fieldset>

			<button onclick={ confirmEdit }>Confirm Edit</button>
		</div>



		<button onclick={ () => modalEditVisible.val = true }>Edit Entry</button>
		<button onclick={ () => modalAddVisible.val = true }>Add Entry</button>
	</div>