import { Component, HostListener } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { OperationsList } from "./operations-list/operations-list";
import { CalcApi } from "./services/calc-api";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: "app-root",
	imports: [
		CommonModule,
		FormsModule,
		OperationsList,
		MatTooltipModule
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
	tooltip: string = "";

	constructor(readonly api: CalcApi) {}

	press(value: string): void {
		let input = this.getInput();
		if (input === "0" && /\d/.test(value)) {
			this.setInput(value);
			this.clearBeforeInput = false;
			return;
		}

		if (input === "0" || input === "-0") {
			if (value === ".") {
				this.addPoint();
			} else {
				this.setInput(input.replace("0", value));
			}
		} else {
			this.addNumber(value);
		}
	}

	clear(): void {
		this.setInput("0");
		this.operation = "";
		this.a = "0";
		this.clearBeforeInput = false;
	}

	backspace(): void {
		let input = this.getInput();
		if (input.length <= 1) {
			this.setInput("0");
			return;
		}
		this.setInput(input.slice(0, -1));
	}

	equals(): void {
		if (this.operation === "" || this.a === "0" || this.clearBeforeInput) {
			return;
		}

		if (this.getInput() === "0" && this.operation === "divide") {
			let index = Math.round(Math.random() * divisionByZeroReplies.length);
			let message = divisionByZeroReplies[index];
			alert(message);
			return;
		}

		this.api.execute(this.operation, this.a, this.getInput())
			.subscribe({
				next: response => {
					let clearedResult = clearResult(response.result);
					this.setInput(clearedResult);
					this.a = clearedResult;
					this.clearBeforeInput = true;
					this.processEggs();
				},
				error: error => {
					alert(error.error);
					console.error(error);
				}
			});
		this.operation = "";
	}

	selectOperation(op: string) {
		if (this.operation !== "" && this.getInput() !== "0" && this.a !== "0") {
			this.equals();
		}

		this.operation = op;
		this.a = this.getInput();
		this.clearBeforeInput = true;
	}

	validInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		let cleanedValue = inputElement.value.replaceAll(/[^-.0-9]/g, "");
		cleanedValue = this.clearMinus(cleanedValue);
		cleanedValue = this.clearPoint(cleanedValue);

		inputElement.value = cleanedValue;
		this.setInput(cleanedValue);
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
		let eventKey = event.key;
		if (/^[fF]\d{1,2}$/.test(eventKey)) {
			return;
		}

		if (/^\d$/.test(eventKey)) {
			this.press(eventKey);
		} else if (eventKey === ".") {
			this.addPoint();
		}

		let key = Operation[eventKey];
		if (key != null) {
			this.selectOperation(key);
		}

		if (eventKey === "Enter") {
			this.equals();
		}

		if (eventKey === "Backspace") {
			this.backspace();
		}

		if (eventKey === "Escape" || eventKey === "Delete") {
			this.clear();
		}
	}

	changeSign() {
		if (this.clearBeforeInput) {
			this.setInput("0");
			this.clearBeforeInput = false;
		}
		let input = this.getInput();
		if (input.startsWith("-")) {
			this.setInput(input.slice(1));
		} else {
			this.setInput("-" + input);
		}
	}

	setInput(value: string) {
		if (this.clearBeforeInput) {
			this.clearBeforeInput = false;
		}
		this.input = value;
	}

	addNumber(value: string) {
		if (this.clearBeforeInput) {
			this.input = "";
			this.clearBeforeInput = false;
		}
		this.input += value;
	}

	getInput() {
		return this.input;
	}

	addPoint() {
		let input = this.getInput();

		if (this.clearBeforeInput) {
			this.setInput("0");
			input = this.getInput();
			this.clearBeforeInput = false;
		}

		if (input.includes(".")) {
			return;
		}

		input += ".";
		this.setInput(input);
	}

	processEggs() {
		let input = Number(this.getInput());

		if (eggs[input] != null) {
			this.tooltip = eggs[input];
		}
	}
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

/**
 * Operations keys that indicate mathematical operations
 */
const Operation: Record<string, string> = {
	"+": "plus",
	"-": "minus",
	"*": "multi",
	"/": "divide"
};

const eggs: Record<number, string> = {
	42: "Відповідь на головне питання життя, Всесвіту та всього такого",
	5318008: "BOOBIES",
	58008: "BOOBS",
	37047734: "hELLOIL",
	53177187714: "hILLBILLIES",
	0.7734: "hELLO",
	2.71828: "e",
	1.618: "φ",
	299792458: "🌞",
	9.81: "🪂",
	9.8: "🪂",
	404: "Not Found",
	1337: "leet",
	69: "😏",
	0.07: "🕶️",
	123456789: "Wow, ти реально це ввів 😅",
	73: "\"найкраще число\" за Шелдоном Купером",
	3.14159: "π",
	3.1415: "π",
	3.141: "π",
	3.14: "π"
}

const divisionByZeroReplies: string[] = [
	"Ой, математична чорна діра — ділення на 0!",
	"На нулі ділимо? Ні, дякую — сьогодні я на дієті від парадоксів.",
	"ERROR: Всесвіт відмовився виконувати цю операцію.",
	"Ділення на 0: коли числа вирішують піти у відпустку.",
	"Спойлер: результат — невизначеність. І кава.",
	"Нуль — це токсичне число для дільника. Тримайся подалі.",
	"Тут мав би бути результат, але він пішов у невідомість.",
	"Не можна. Нуль має індивідуальні права.",
	"Вибач, калькулятор вийшов в астрал через цю спробу.",
	"Розрахунок згорів. Пожежна служба викликана.",
	"Так не робиться — це як ділити торт на ніяких гостей.",
	"Нуль вперся — жодного поділу не буде.",
	"Парадокс активовано. Радимо відпочити і спробувати інше число.",
	"Обережно: відкриваєш портал у вимір '∞?'.",
	"Математика каже: 'Я втомився'.",
	"Система: '403 Forbidden — ділення на 0 заборонено'.",
	"Нуль — це VIP: йому не можна ділитися.",
	"Результат: баг у реальності. Збережіть роботу.",
	"Ділення на 0 — класичний трюк для розваги богів.",
	"Замість числа отримаєш мем: ∞ (але не той, що треба).",
	"Це не помилка — це експеримент з квантовою невизначеністю.",
	"Ой-ой — ми відправили запит у чорну діру. Повернення немає.",
	"Почекай… Ні, навпаки — не чекай. Просто вибери інше число.",
	"Тут мав би бути результат. Але його з'їв нуль.",
	"Нуль: 1 — 0 = 1. Ділення: 1 / 0 = *жах*",
	"Код відповідає: 'Nope'.",
	"Математичний гумор: не ділити на нуль, серйозно.",
	"Результат — художня інтерпретація нескінченності.",
	"Запит відхилено політикою Всесвіту.",
	"Нуль зберігає тишу. Давайте поважати його бажання."
];
