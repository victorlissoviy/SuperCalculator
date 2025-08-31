import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { OperationsList } from "./operations-list/operations-list";
import { CalcApi } from "./services/calc-api";

@Component({
	selector: "app-root",
	imports: [
		CommonModule,
		FormsModule,
		OperationsList,
	],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
	standalone: true
})
export class App {
	title: string = "Calculator";
	input: string = "0";
	operation: string = "";
	a: string = "0";

	constructor(readonly api: CalcApi) {}

	press(value: string): void {
		if (this.input === "0" && /\d/.test(value)) {
			this.input = value;
			return;
		}
		if (value === "." && this.input.includes(".")) {
			return;
		}
		this.input += value;
	}

	clear(): void {
		this.input = "0";
	}

	backspace(): void {
		if (this.input.length <= 1) {
			this.input = "0";
			return;
		}
		this.input = this.input.slice(0, -1);
	}

	equals(): void {
		this.api.execute(this.operation, this.a, this.input).subscribe(response => {
			this.input = response.result;
			this.a = response.result;
		});
	}

	selectOperation(op: string) {
		this.operation = op;
		this.a = this.input;
		this.input = "0";
	}
}
