import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


import { Textarea } from "./Textarea.tsx";

import InputGroupComponent from "./InputGroupSm.tsx";



const editMode = $$(true);

const currentMark = $$("");



type Props = {
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

	deleteEntry: (id: string) => undefined,
}


function checkedBtn(bool: boolean) {
	return bool.val ? "checked_btn" : "" }

const availibleMarks = $$(["👍", "👎", "❤️", "💔", "❌", "❗️","🕑"]);


@template(function (this: ListEntry, props) {
	return (
		<li class="list-group-item">
			<table>
				<tbody>
					<tr class="custom-line-height">
						<td>
							<a class="btn btn-outline movie-mark" 
								href="#" role="button" 
								id="dropdownMenuLink" 
								data-bs-toggle="dropdown" 
								data-toggle="tooltip"
								title="Click to edit">
								{ props.mark }
							</a>

							<div class="dropdown-menu">
								{ availibleMarks.map((mark) => <button class="dropdown-item" onclick={ () => props.mark.val = mark }>{ mark }</button>) }
								<button class="dropdown-item" data-toggle="tooltip" title="Add custom" data-bs-toggle="modal" data-bs-target="#addReactionModal">+</button>
							</div>
						
							<input style="margin-right:10px;" type="checkbox" style="opacity:0;" checked={ props.seasons.every(el => el) }></input>
						</td>
						<td>
							<a class="button-as-link movie-title" 
								data-bs-toggle="collapse" 
								href={ `#collapseInfo-${props.id}` }
								role="button" 
								aria-expanded="false" 
								aria-controls={ `collapseInfo-${props.id}` }>
								{ props.title }
							</a>
						</td>
						<td>
							{ props.$.seasons.$.map((_, index) => <button class={`season-check ${checkedBtn(props.$.seasons.$[index])}`} onclick={ () => props.$.seasons.$[index].val = !props.$.seasons.$[index].val }>{index + 1}</button>) }

							<button class="season-check" data-toggle="tooltip" title="Add a season" onclick={ () => props.seasons.push(false) }>+</button>
							<button class="button-as-text" onclick={() => props.deleteEntry(props.id)}>🗑️</button>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="collapse" id={ `collapseInfo-${ props.id }` }>
				<div class="card w-100">
					<div class="d-flex">
						<img class="poster-img" src={ props.poster } alt="none" style="max-height:100%; max-width:100%" />
						<div class="card-body">
							<InputGroupComponent for="Title" type="text" value={props.title} />

							<button class="badge rounded-pill bg-light text-dark" onclick={ () => this.addWiki(props.title) }>Search Additional Info </button>

							<div class="additionalInfo">
								
							</div>

							<div style="height: 125px;">
								{always(() => editMode.val ? <p class="card-text">{props.plot}</p> : <p><Textarea value={props.plot}/></p>)}
							</div>
							<button class="badge rounded-pill bg-light text-dark" onclick={() => (editMode.val = !editMode.val)}>
								{always(() => editMode.val ? "Edit description" : "Save Changes")}
							</button>

							<InputGroupComponent for="Total Seasons" type="number" value={props.$.total_seasons} />
							<InputGroupComponent for="Year From" type="number" value={props.year_from} />
							<InputGroupComponent for="Year To" type="number" value={props.year_to} />
							<InputGroupComponent for="Runtime" type="number" value={props.runtime} />
							<InputGroupComponent for="Genre" type="text" value={props.genre} />

							<InputGroupComponent for="Poster" type="url" value={props.poster} />
						</div>
					</div>

					<div class="card-body">
						<a class="card-link"
							data-bs-toggle="collapse" 
							href="#collapseMoreInfo" 
							role="button" 
							aria-expanded="false" 
							aria-controls="collapseMoreInfo">
								Show more details
							</a>
						<div class="collapse" id="collapseMoreInfo">
							<InputGroupComponent for="Country" type="text" value={props.country} />
							<InputGroupComponent for="Language" type="text" value={props.language} />
							<InputGroupComponent for="Actors" type="text" value={props.actors} />
							<InputGroupComponent for="Awards" type="text" value={props.awards} />
							<InputGroupComponent for="Director" type="text" value={props.director} />
							<InputGroupComponent for="IMDB ID" type="text" value={props.imdbID} />
							<InputGroupComponent for="IMDB Rating" type="text" value={props.imdbRating} />
							<InputGroupComponent for="IMDB Votes" type="text" value={props.imdbVotes} />
							<InputGroupComponent for="Metascore" type="text" value={props.metascore} />
							<InputGroupComponent for="Rated" type="text" value={props.rated} />
							<InputGroupComponent for="Writer" type="text" value={props.writer} />

							<InputGroupComponent for="Finished" type="checkbox" value={props.finished} />
						</div>
					</div>
					</div>
			</div>

			<div class="modal fade" id="addReactionModal" tabindex="-1">
				<div class="modal-dialog">
					<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Add custom reaction</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<div class="input-group mb-3">
							<input type="text" class="form-control" placeholder="Enter custom reaction" value={ currentMark }/>
							<button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal" onclick={() => props.mark.val = currentMark.val}>Add</button>
						</div>
					</div>
					</div>
				</div>
			</div>
			
			<div class="modal fade" 
				id="editEntryModal" 
				tabindex="-1" 
				role="dialog" 
				aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="editEntryModal">Edit Entry</h5>
							<button type="button" 
								class="close" 
								data-bs-dismiss="modal" 
								aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							{/* <img src={ props.poster } alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img> */}
								<form>
									<div class="form-group">
										<label for="exampleForm">Upload A Poster</label>
										<input type="file" class="form-control-file" id="exampleForm" />
									</div>
								</form>

							<InputGroupComponent for="Title" type="text" value={props.title} />
							<InputGroupComponent for="Total Seasons" type="number" value={props.total_seasons} />
							<InputGroupComponent for="Year From" type="number" value={props.year_from} />
							<InputGroupComponent for="Year To" type="number" value={props.year_to} />
							<InputGroupComponent for="Runtime" type="number" value={props.runtime} />
							<InputGroupComponent for="Genre" type="text" value={props.genre} />
							<InputGroupComponent for="Country" type="text" value={props.country} />
							<InputGroupComponent for="Language" type="text" value={props.language} />

							<InputGroupComponent for="Actors" type="text" value={props.actors} />
							<InputGroupComponent for="Awards" type="text" value={props.awards} />
							<InputGroupComponent for="Director" type="text" value={props.director} />
							<InputGroupComponent for="IMDB ID" type="text" value={props.imdbID} />
							<InputGroupComponent for="IMDB Rating" type="text" value={props.imdbRating} />
							<InputGroupComponent for="IMDB Votes" type="text" value={props.imdbVotes} />
							<InputGroupComponent for="Metascore" type="text" value={props.metascore} />
							<InputGroupComponent for="Plot" type="text" value={props.plot} />
							<InputGroupComponent for="Rated" type="text" value={props.rated} />
							<InputGroupComponent for="Writer" type="text" value={props.writer} />

							<InputGroupComponent for="Finished" type="checkbox" value={props.finished} />
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close
							</button>
							<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
						</div>
					</div>
				</div>
			</div>
		</li>
	)
})


export class ListEntry extends Component<Props> {
	updateInfo(name) {
		fetch(`http://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=${name}&rvsection=0`)
		.then(resp => resp.json())
		.then(data => {
	
			const pageId = Object.keys(data.query.pages)[0]
	
			if (data.query.pages[pageId].revisions) {
				const page = data.query.pages[pageId].revisions[0]
				const text = JSON.stringify(page)
	
				if (text.includes("redirect") || text.includes("REDIRECT")) {
					const didYouMean = text.split("[[").slice(-1)[0].split("]]")[0]
					
					alert("Did you mean " + didYouMean)
					console.log("Did you mean", didYouMean)
				} else {
	
					let totalSeasons, genre, country, language, runtime, first, end;
	
					if (text.includes("num_seasons")) {
						totalSeasons = parseInt(text.split("num_seasons")[1].split("= ")[1].split("\\n")[0], 10);
					} else if (text.includes("num_series")) {
						totalSeasons = parseInt(text.split("num_series")[1].split("= ")[1].split("\\n")[0], 10);
					}
	
					text.includes("genre") ? genre = text.split("genre")[1].split("[[")[1].split("]]")[0] : genre = "<not found>"
					text.includes("country") ? country = text.split("country")[1].split("=")[1].split("\\n")[0] : console.log("country not found");
					text.includes("language") ? language = text.split("language")[1].split("=")[1].split("\\n")[0] : console.log("language not found");
					text.includes("runtime") ? runtime = parseInt(text.split("runtime")[1].split("=")[1].split("\\n")[0], 10) : console.log("runtime not found");
					text.includes("Start date") ? first = parseInt(text.split("Start date")[1].split("\\n")[0].slice(1, 5), 10) : console.log("first not found");
					text.includes("End date") ? end = parseInt(text.split("End date")[1].split("\\n")[0].slice(1, 5), 10) : console.log("end not found");
	
					console.log(name, "genre:", genre, "country:", country, "lang:", language, "time", runtime,
										"first:", first, "end:", end, "seasons:", totalSeasons)
	
					
	
					return ({"genre": genre,
								"country": country,
								"language": language,
								"runtime": runtime,
								"year": first})
	
				}
	  
			} else { console.log("page not found: ", name) }   
		})
	}

	addWiki(titleRef: string) {
		if (titleRef.val && titleRef.val.length > 0) {
			fetch("https://en.wikipedia.org/w/api.php?action=opensearch&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&search="+titleRef.val)
				.then(resp => resp.json())
				.then(data => {
					let link = data[3][0]
					if (data[1].filter(elt => elt.includes("TV")).length > 0) {
						link = data[3][data[1].indexOf(data[1].filter(elt => elt.includes("TV"))[0])]
					} 
			
					let name = titleRef.val
					if (link && link.includes("/")) {
						name = link.split("/").slice(-1)[0]
					} else { 
						console.log("link is not defined: ", name, link) 
					}
					
					this.updateInfo(name)
				})
		}   
	}
}
