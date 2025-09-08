import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CalcApi } from "../services/calc-api";

@Component({
	selector: "app-operations-list",
	standalone: true,
	imports: [],
	templateUrl: "./operations-list.html",
	styleUrl: "./operations-list.scss"
})
export class OperationsList implements OnInit {
	operations: string[] = [];
	@Output() clickOperation: EventEmitter<string> = new EventEmitter<string>();
	translations: Record<string, string> = {
		"plus": "+",
		"minus": "-",
		"multi": "*",
		"divide": "/"
	};

	constructor(readonly api: CalcApi) {}

	ngOnInit(): void {
		this.createListOperations();
	}

	createListOperations() {
		this.api.getOperations()
			.subscribe(operations => {
				this.operations = operations;
			});
	}

	onClick(event: MouseEvent) {
		const button = event.target as HTMLButtonElement;

		let value = button.id;
		this.clickOperation.emit(value);
	}
}
