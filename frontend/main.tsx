import { ListEntry } from "./ListEntry.tsx";
import { items } from "../backend/data.ts";

function addItem() {	
	items.push({
		amount: currentAmount.val,
		type: currentType.val,
		name: currentName.val,
		checked: false
	});

	modalVisible.val = false;
}

const currentAmount = $$(0);
const currentType = $$("Bottles");
const currentName = $$("");

const modalVisible = $$(false);

currentAmount.val = 3;
export default
	<div id="main">
		<h1>Jakob's Shopping List</h1>
		<hr />

		{ items.$.map(item => <ListEntry {...item.$}></ListEntry> ) }

		<div id="add-item-modal" class={  { visible: modalVisible }  }>
			<fieldset>
				<legend>Item Properties</legend>

				<input type="number" placeholder="Amount" value={ currentAmount } />

				<select value={ currentType }>
					<option selected>Bottles</option>
					<option>Pieces</option>
				</select>

				<input type="text" placeholder="Name" value={ currentName } />
			</fieldset>

			<button onclick={ addItem }>Add Item</button>
		</div>

		<button onclick={ () => modalVisible.val = true }>Add Item</button>
	</div>