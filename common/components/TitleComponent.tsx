import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


interface Props {
    value: any;
}

@template(function(this: TitleComponent, props) {
    return (
        <li>
            <button type="button" 
                    class="button-as-text" 
                    data-toggle="tooltip" 
                    title="Click to edit" 
                    onclick={() => this.toggleDisabled()}>EditTitle</button>
            <input type="text" class="input-group-component" value={ props.value } disabled={this.$.isDisabled} style="display: inline-block; width: auto;" />
        </li>
    );
})


class TitleComponent extends Component<Props> {
    @property isDisabled = true;

    toggleDisabled() {
        this.isDisabled = !this.isDisabled;
    }
}


export default TitleComponent;