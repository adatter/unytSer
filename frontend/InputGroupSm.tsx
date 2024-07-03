import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


interface Props {
	for: string,
    type: string;
    value: any;
}

@template(function(this: InputGroupComponent, props) {
    return (
        <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">{ props.for }</span>
            </div>
            <input type={ props.type } class="form-control" value={ props.value } disabled={this.$.isDisabled} />
            <button type="button" class="badge text-bg-light" onclick={() => this.toggleDisabled()}>✍</button>
        </div>
    );
})

@style(css `
	input:disabled {
    border: none;
    background-color: transparent;
    color: inherit;
    cursor: text;
    };

    .input-group input-group-sm mb-3 {
    padding: 0px;
    margin: 0px;
    }
`)

class InputGroupComponent extends Component<Props> {
    @property isDisabled = true;

    toggleDisabled() {
        this.isDisabled = !this.isDisabled;
    }
}


export default InputGroupComponent;