import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


@template(() => {
	<div class="modal fade" tabindex="-1" id="modalNotFound">
				<div class="modal-dialog">
					<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Not Found</h5>
						<button type="button" 
								class="btn-close" 
								data-bs-dismiss="modal" 
								aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>Title not found. You can add info manually or try searching again.</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Try Again</button>
						<button type="button" class="btn btn-primary" onclick={ addMovie }>Add Manually</button>
					</div>
					</div>
				</div>
			</div>
});

export class ModalNotFound extends Component{};


