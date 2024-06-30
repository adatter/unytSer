import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


interface Props {
	for: string,
    type: string;
    value: any;
}

@template<Props>((props) =>
    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text">{ props.for }</span>
        </div>
        <input type={ props.type } class="form-control" value={ props.value }/>
    </div>
)
class InputGroupComponent extends Component<Props> {
    
}

export default InputGroupComponent;