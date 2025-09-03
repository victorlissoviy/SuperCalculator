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
		OperationsList
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

	validInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		let cleanedValue = inputElement.value.replace(/[^-.0-9]/g, "");
		cleanedValue = this.clearMinus(cleanedValue);
		cleanedValue = this.clearPoint(cleanedValue);

		inputElement.value = cleanedValue;
		this.input = cleanedValue;
	}

	/**
	 * Clear minus sign from the string, only the on start minus sign is allowed
	 *
	 * @param value source string
	 * @returns cleaned string
	 * @private
	 */
	private clearMinus(value: string) {
		let index = value.lastIndexOf("-");
		while (index > 1) {
			value = value.slice(0, index) + value.slice(index + 1);
			index = value.lastIndexOf("-");
		}
		return value;
	}

	/**
	 * Clear point from the string, only the first point is allowed
	 *
	 * @param value source string
	 * @returns cleaned string
	 * @private
	 */
	private clearPoint(value: string) {
		let index = value.indexOf(".");
		if (index !== -1) {
			let lastIndex = value.lastIndexOf(".");
			while (index !== lastIndex) {
				value = value.slice(0, lastIndex) + value.slice(lastIndex + 1);
				lastIndex = value.lastIndexOf(".");
			}
		}
		return value;
	}
}
