import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";

import InputGroupComponent from "../components/InputGroupSm.tsx";

type Props = {
	currentImg: string,
	currentTitle: string,
	currentTotal: number,
	currentYearFrom: number,
	currentYearTo: number,
	currentRuntime: number,
	currentGenre: string,
	currentCountry: string,
	currentLanguage: string,
	currentActors: string,
	currentAwards: string,
	currentDirector: string,
	currentImdbID: string,
	currentImdbRating: string,
	currentImdbVotes: string,
	currentMetascore: string,
	currentRated: string,
	currentWriter: string,
	currentPlot: string,
	currentFinished: boolean,

	addItem: () => undefined
}
  
@template<Props>((props) => {
	return (
		<div id="addManuallyModal" 
		class="modal fade" 
		tabindex="-1" 
		role="dialog"
		onkeydown={ (e) => e.code == "Enter" ? props.addItem() : {} }>
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
					<img src={ props.currentImg } alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img>
						
					<InputGroupComponent for="Poster URL" type="url" value={ props.currentImg } />
					<InputGroupComponent for="Title" type="text" value={ props.currentTitle } />
					<InputGroupComponent for="Total Seasons" type="number" value={ props.currentTotal } />
					<InputGroupComponent for="Year From" type="number" value={ props.currentYearFrom } />
					<InputGroupComponent for="Year To" type="number" value={ props.currentYearTo } />
					<InputGroupComponent for="Runtime" type="number" value={ props.currentRuntime } />
					<InputGroupComponent for="Genre" type="text" value={ props.currentGenre } />
					<InputGroupComponent for="Country" type="text" value={ props.currentCountry } />
					<InputGroupComponent for="Language" type="text" value={ props.currentLanguage } />

					<InputGroupComponent for="Actors" type="text" value={ props.currentActors } />
					<InputGroupComponent for="Awards" type="text" value={ props.currentAwards } />
					<InputGroupComponent for="Director" type="text" value={ props.currentDirector } />
					<InputGroupComponent for="IMDB ID" type="text" value={ props.currentImdbID } />
					<InputGroupComponent for="IMDB Rating" type="text" value={ props.currentImdbRating } />
					<InputGroupComponent for="IMDB Votes" type="text" value={ props.currentImdbVotes } />
					<InputGroupComponent for="Metascore" type="text" value={ props.currentMetascore } />

					<InputGroupComponent for="Plot" type="text" value={ props.currentPlot } />

					<InputGroupComponent for="Rated" type="text" value={ props.currentRated } />
					<InputGroupComponent for="Writer" type="text" value={ props.currentWriter } />

					<InputGroupComponent for="Finished" type="checkbox" value={ props.currentFinished } />
				</div>
				<div class="modal-footer">
					<button type="button" 
							class="btn btn-secondary" 
							data-bs-dismiss="modal"
							id="addManuallyCloseBtn">
								Cancel
					</button>
					<button type="button" 
							onclick={ props.addItem } 
							class="btn btn-primary" 
							data-bs-dismiss="modal">
								Add Entry
					</button>
				</div>
			</div>
		</div>
	</div>
	);
})

export class addManuallyModal extends Component{};