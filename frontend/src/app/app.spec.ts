import { ComponentFixture, TestBed } from "@angular/core/testing";
import { App } from "./app";
import {
	HttpTestingController,
	provideHttpClientTesting
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { CalcResponse } from "./interfaces/CalcResponse";

describe("App", () => {
	let component: App;
	let fixture: ComponentFixture<App>;
	let compiled: HTMLElement;
	let httpMock: HttpTestingController;

	const baseUrl = "http://localhost:8080";
	const mockResponse: string[] = ["plus", "minus", "multi", "divide"];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting()
			],
			imports: [App]
		}).compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(App);
				component = fixture.componentInstance;
				compiled = fixture.nativeElement as HTMLElement;
				httpMock = TestBed.inject(HttpTestingController);

				fixture.detectChanges();
				const req = httpMock.expectOne(baseUrl + "/calc");
				req.flush(mockResponse);
			});
	});

	afterEach(() => {
		httpMock.verify();
	});

	function getButton(idText: string) {
		const buttons = compiled.querySelectorAll(".btn");
		for (let i = 0 ; i < buttons.length ; i++) {
			const button = buttons[i] as HTMLButtonElement;
			if (button.id === idText) {
				return button;
			}
		}
		throw new Error(`Button "${idText}" not found`);
	}

	it("should create the app", () => {
		expect(component != null).toBe(true);
	});

	it("should render title", () => {
		const dom = fixture.nativeElement as HTMLElement;
		expect(dom.querySelector("h1")?.textContent).toContain("Calculator");
	});

	it("should render the input", () => {
		const dom = fixture.nativeElement as HTMLElement;
		let inputElement = dom.querySelector(".main-input");
		expect(inputElement != null).toBe(true);

		let input = inputElement as HTMLInputElement;
		expect(input.value).toContain("0");
	});

	it("should update DOM when component.input changes", async () => {
		component.input = "123";

		fixture.detectChanges();
		await fixture.whenStable();

		let input = compiled.querySelector(".main-input") as HTMLInputElement;

		expect(input.value).toBe("123");
	});

	it("should update component.input when DOM changes", async () => {
		let input = compiled.querySelector(".main-input") as HTMLInputElement;
		input.value = "456";
		input.dispatchEvent(new Event("input"));

		fixture.detectChanges();
		await fixture.whenStable();

		expect(component.input).toBe("456");
	});

	it("should be zero point", async () => {
		const input = compiled.querySelector(".main-input") as HTMLInputElement;
		expect(input.value).toBe("0");

		const pointButton = getButton(".");

		pointButton.click();
		fixture.detectChanges();
		await fixture.whenStable();

		expect(input.value).toBe("0.");

		pointButton.click();
		fixture.detectChanges();
		await fixture.whenStable();

		expect(input.value).toBe("0.");
	});

	it("should choose operation", () => {
		fixture.detectChanges();
		const plusButton = compiled.querySelector(".operation") as HTMLButtonElement;
		expect(plusButton != null).toBe(true);

		plusButton.click();

		expect(component.operation).toBe("plus");
	});

	it("should add numbers", async () => {
		fixture.detectChanges();

		const oneButton = getButton("1");
		const twoButton = getButton("2");
		const pointButton = getButton(".");
		const plusButton = getButton("plus");
		const equalButton = getButton("=");

		expect(oneButton != null).toBe(true);
		expect(twoButton != null).toBe(true);
		expect(pointButton != null).toBe(true);
		expect(plusButton != null).toBe(true);
		expect(equalButton != null).toBe(true);

		pointButton.click();
		oneButton.click();
		plusButton.click();

		expect(component.operation).toBe("plus");
		expect(component.a).toBe("0.1");
		expect(component.input).toBe("0.1");

		pointButton.click();

		expect(component.input).toBe("0.");
		fixture.detectChanges();

		twoButton.click();
		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		const equalResponse: CalcResponse = {
			result: "0.3"
		};

		let req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "plus",
			a: "0.1",
			b: "0.2"
		});
		req.flush(equalResponse);

		fixture.detectChanges();
		await fixture.whenStable();

		const result = compiled.querySelector(".main-input") as HTMLInputElement;
		expect(result.value).toBe("0.3");

		expect(component.operation).toBe("");
		expect(component.a).toBe("0.3");
	});

	it("multiple operations", async () => {
		fixture.detectChanges();

		const plusButton = getButton("plus");
		const minusButton = getButton("minus");
		const oneButton = getButton("1");
		const twoButton = getButton("2");
		const equalButton = getButton("=");

		oneButton.click();
		plusButton.click();
		twoButton.click();
		equalButton.click();

		let calcResponse: CalcResponse = {
			result: "3"
		};

		let req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "plus",
			a: "1",
			b: "2"
		});
		req.flush(calcResponse);

		fixture.detectChanges();
		await fixture.whenStable();

		const result = compiled.querySelector(".main-input") as HTMLInputElement;
		expect(result.value).toBe("3");
		expect(component.operation).toBe("");
		expect(component.a).toBe("3");

		calcResponse = {
			result: "2"
		};

		minusButton.click();
		oneButton.click();
		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "minus",
			a: "3",
			b: "1"
		});
		req.flush(calcResponse);

		fixture.detectChanges();
		await fixture.whenStable();

		expect(result.value).toBe("2");
		expect(component.operation).toBe("");
		expect(component.a).toBe("2");
	});

	it("multiple operations with equal", async () => {
		fixture.detectChanges();

		const plusButton = getButton("plus");
		const sevenButton = getButton("7");
		const fiveButton = getButton("5");
		const equalButton = getButton("=");

		sevenButton.click();
		plusButton.click();
		fiveButton.click();
		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		let calcResponse: CalcResponse = {
			result: "12"
		};

		let req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "plus",
			a: "7",
			b: "5"
		});
		req.flush(calcResponse);

		fixture.detectChanges();
		await fixture.whenStable();

		const result = compiled.querySelector(".main-input") as HTMLInputElement;
		expect(result.value).toBe("12");
		expect(component.operation).toBe("");
		expect(component.a).toBe("12");

		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		expect(result.value).toBe("12");
		expect(component.operation).toBe("");
		expect(component.a).toBe("12");
	});

	it("filter input field with numbers", async () => {
		let input = compiled.querySelector(".main-input") as HTMLInputElement;
		expect(input.value).toBe("0");

		input.value = "0a";

		// after input, we need to dispatch event to update input

		let inputEvent = new InputEvent("input", {data: "a"});
		input.dispatchEvent(inputEvent);

		fixture.detectChanges();

		expect(input.value).toBe("0");
	});

	// in this code we need to add tests for many minus and point sing, but it
	// for future :-)

	it("error dividing by zero", async () => {
		fixture.detectChanges();
		await fixture.whenStable();

		spyOn(window, "alert");

		component.a = "1";
		component.operation = "divide";
		component.input = "0";
		let equalButton = getButton("=");
		equalButton.click();

		expect(window.alert).toHaveBeenCalled();
	});

	it("display symbolic operation names", () => {
		fixture.detectChanges();

		const plusButton = getButton("plus");
		expect(plusButton != null).toBe(true);
		expect(plusButton.textContent).toBe(" + ");
	});

	it("should react to + key press", () => {
		const event = new KeyboardEvent("keydown", {key: "+"});
		window.dispatchEvent(event);

		fixture.detectChanges();

		expect(component.operation).toBe("plus");
	});

	it("work as sipmle calculator", async () => {
		fixture.detectChanges();
		await fixture.whenStable();

		const oneButton = getButton("1");
		const twoButton = getButton("2");
		const threeButton = getButton("3");
		const plusButton = getButton("plus");
		const equalButton = getButton("=");
		const multiButton = getButton("multi");

		oneButton.click();
		twoButton.click();
		plusButton.click();
		twoButton.click();
		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		let calcResponse: CalcResponse = {
			result: "14"
		};

		let req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "plus",
			a: "12",
			b: "2"
		});
		req.flush(calcResponse);

		fixture.detectChanges();
		await fixture.whenStable();

		expect(component.operation).toBe("");
		expect(component.a).toBe("14");
		expect(component.input).toBe("14");

		multiButton.click();
		threeButton.click();
		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		calcResponse = {
			result: "42"
		};

		req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "multi",
			a: "14",
			b: "3"
		});
		req.flush(calcResponse);

		fixture.detectChanges();
		await fixture.whenStable();

		expect(component.operation).toBe("");
		expect(component.a).toBe("42");
		expect(component.input).toBe("42");
	});

	it("ignore enter f-keys", () => {
		const event = new KeyboardEvent("keydown", {key: "F12"});
		window.dispatchEvent(event);

		fixture.detectChanges();

		expect(component.operation).toBe("");
		expect(component.a).toBe("0");
		expect(component.input).toBe("0");
	});

	it("multiply minus number", async () => {
		fixture.detectChanges();
		await fixture.whenStable();

		const fiveButton = getButton("5");
		const multiButton = getButton("multi");
		const equalButton = getButton("=");
		const plusMinusButton = getButton("+/-");

		fiveButton.click();
		expect(component.input).toBe("5");

		multiButton.click();
		expect(component.input).toBe("5");
		expect(component.operation).toBe("multi");

		plusMinusButton.click();
		fixture.detectChanges();

		expect(component.input).toBe("-0");
		expect(component.operation).toBe("multi");

		fiveButton.click();
		expect(component.input).toBe("-5");
		expect(component.operation).toBe("multi");

		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		const calcResponse: CalcResponse = {
			result: "-25"
		};

		let req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "multi",
			a: "5",
			b: "-5"
		});
		req.flush(calcResponse);

		expect(component.operation).toBe("");
		expect(component.a).toBe("-25");
		expect(component.input).toBe("-25");
	});

	it("multiply enter equal", async () => {
		fixture.detectChanges();
		await fixture.whenStable();

		const fiveButton = getButton("5");
		const sevenButton = getButton("7");
		const equalButton = getButton("=");
		const plusButton = getButton("plus");

		sevenButton.click();
		fiveButton.click();
		plusButton.click();

		expect(component.input).toBe("75");
		expect(component.a).toBe("75");
		expect(component.operation).toBe("plus");

		equalButton.click();

		expect(component.input).toBe("75");
		expect(component.a).toBe("75");
		expect(component.operation).toBe("plus");
	});

	it("should decimal point", async () => {
		fixture.detectChanges();
		await fixture.whenStable();

		const oneButton = getButton("1");
		const pointButton = getButton(".");

		oneButton.click();
		pointButton.click();

		expect(component.input).toBe("1.");
		expect(component.operation).toBe("");

		pointButton.click();
		expect(component.input).toBe("1.");
		expect(component.operation).toBe("");
	});

	it("multiply plus number", async () => {
		fixture.detectChanges();
		await fixture.whenStable();

		const zeroButton = getButton("0");
		const oneButton = getButton("1");
		const fiveButton = getButton("5");
		const plusButton = getButton("plus");

		fiveButton.click();
		zeroButton.click();

		plusButton.click();
		expect(component.input).toBe("50");
		expect(component.operation).toBe("plus");
		expect(component.a).toBe("50");

		fiveButton.click();
		expect(component.input).toBe("5");

		plusButton.click();

		let response: CalcResponse = {
			result: "55"
		};

		let req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "plus",
			a: "50",
			b: "5"
		});
		req.flush(response);

		fixture.detectChanges();
		await fixture.whenStable();
		expect(component.input).toBe("55");
		expect(component.operation).toBe("plus");

		oneButton.click();
		zeroButton.click();

		expect(component.operation).toBe("plus");
		expect(component.a).toBe("55");
		expect(component.input).toBe("10");

		plusButton.click();

		response = {
			result: "65"
		};

		req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "plus",
			a: "55",
			b: "10"
		});
		req.flush(response);

		fixture.detectChanges();
		await fixture.whenStable();

		expect(component.input).toBe("65");
		expect(component.operation).toBe("plus");
		expect(component.a).toBe("65");
	});

	it("eggs", () => {

		interface Egg {
			input: string;
			result: string;
		}

		function checkEgg(egg:Egg) {
			component.setInput(egg.input);
			component.processEggs();

			expect(component.tooltip).toBe(egg.result);
		}

		const eggs: Egg[] = [
			{
				input: "42",
				result: "Відповідь на головне питання життя, Всесвіту та всього такого"
			},
			{input: "3.14", result: "π"},
			{input: "5318008", result: "BOOBIES"},
			{input: "58008", result: "BOOBS"},
			{input: "37047734", result: "hELLOIL"},
			{input: "53177187714", result: "hILLBILLIES"},
			{input: "0.7734", result: "hELLO"},
			{input: "2.71828", result: "e"},
			{input: "1.618", result: "φ"},
			{input: "299792458", result: "🌞"},
			{input: "9.81", result: "🪂"},
			{input: "404", result: "Not Found"},
			{input: "1337", result: "leet"},
			{input: "69", result: "😏"},
			{input: "0.07", result: "🕶️"},
			{input: "123456789", result: "Wow, ти реально це ввів 😅"},
			{input: "73", result: "\"найкраще число\" за Шелдоном Купером"},
		];

		eggs.forEach(checkEgg);
	})
});
