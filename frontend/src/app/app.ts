import { Component, HostListener } from "@angular/core";
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
	clearBeforeInput: boolean = false;

	constructor(readonly api: CalcApi) {}

	press(value: string): void {
		if (this.input === "0" && /\d/.test(value)) {
			this.input = value;
			this.clearBeforeInput = false;
			return;
		}
		if (value === "." && this.input.includes(".")
		  && !this.clearBeforeInput) {
			return;
		}
		if (this.clearBeforeInput) {
			if (value === ".") {
				this.input = "0";
			} else {
				this.input = "";
			}
			this.clearBeforeInput = false;
		}
		this.input += value;
	}

	clear(): void {
		this.input = "0";
		this.operation = "";
		this.a = "0";
		this.clearBeforeInput = false;
	}

	backspace(): void {
		if (this.input.length <= 1) {
			this.input = "0";
			return;
		}
		this.input = this.input.slice(0, -1);
	}

	equals(): void {
		if (this.operation === "" || this.a === "0") {
			return;
		}

		function clearResult(result: string) {
			if (result.includes(".")) {
				while (result.endsWith("0")) {
					result = result.slice(0, -1);
				}
				if (result.endsWith(".")) {
					result = result.slice(0, -1);
				}
			}
			return result;
		}

		this.api.execute(this.operation, this.a, this.input)
			.subscribe({
				next: response => {
					let clearedResult = clearResult(response.result);
					this.input = clearedResult;
					this.a = clearedResult;
					this.clearBeforeInput = true;
				},
				error: error => {
					alert(error.error);
					console.error(error);
				}
			});
		this.operation = "";
	}

	selectOperation(op: string) {
		if (this.operation !== "" && this.input !== "0" && this.a !== "0") {
			this.equals();
		}

		this.operation = op;
		this.a = this.input;
		this.clearBeforeInput = true;
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

	@HostListener("window:keydown", ["$event"])
	onKeyDown(event: KeyboardEvent) {
		if (/^[\d.]/.test(event.key)) {
			this.press(event.key);
		}

		/**
		 * Operations keys that indicate mathematical operations
		 */
		let operations : Record<string, string> = {
			"+": "plus",
			"-": "minus",
			"*": "multi",
			"/": "divide"
		};

		if (Object.keys(operations).includes(event.key)) {
			this.selectOperation(operations[event.key]);
		}

		if (event.key === "Enter") {
			this.equals();
		}

		if (event.key === "Backspace") {
			this.backspace();
		}

		if (event.key === "Escape" || event.key === "Delete") {
			this.clear();
		}
	}
}
