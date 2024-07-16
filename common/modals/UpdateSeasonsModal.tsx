import { WebSocketInterface } from "unyt_core/network/communication-interfaces/websocket-interface.ts";
import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";

type Props = {
	searchingSeasons: boolean;
	currentTitle: string;
	updateSeasonsPercentage: boolean,
	updateSeasonsBarVisible: boolean,
	noNewSeasonsFound: boolean,
	newSeasonsArray: string[],

}

@template<Props>((props) => {
	return (
		<div id="updateSeasonsModal" 
			class="modal fade" 
			tabindex="-1" 
			role="dialog" 
			aria-labelledby="updateSeasonsModalLabel" 
			aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="upsateSeasonsModal">Search for new seasons</h5>
						<button type="button" 
							class="close" 
							data-bs-dismiss="modal" 
							aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
							{ always(() => props.searchingSeasons.val ? <p>Checking if there are new seasons for: <strong>{ props.currentTitle }</strong></p> : <p></p>) }
							
							<div id="myProgress" class={ { visible: props.updateSeasonsBarVisible } }>
								<div id="myBar" style={ { width: props.updateSeasonsPercentage } }></div>
							</div>

							{ always(() =>  props.noNewSeasonsFound.val ? <p>Nothing new yet...</p>: <p>Possibly there are new seasons out for:</p>)}

							<ul>
							{ props.newSeasonsArray.$.map(item =>
								<li><strong>{ item.title }</strong>: new seasons: { item.number }</li>
							)}
							</ul>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success" data-bs-dismiss="modal">Ok</button>
					</div>
				</div>
			</div>
		</div>
	);
})

export class UpdateSeasonsModal extends Component{};

