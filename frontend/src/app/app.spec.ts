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

	function getButton(innerText: string) {
		const buttons = compiled.querySelectorAll(".btn");
		for (let i = 0 ; i < buttons.length ; i++) {
			const button = buttons[i] as HTMLButtonElement;
			if (button.innerText === innerText) {
				return button;
			}
		}
		throw new Error(`Button "${innerText}" not found`);
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

		function getPointButton(): HTMLButtonElement {
			const buttons = compiled.querySelectorAll(".btn");
			for (let i = 0 ; i < buttons.length ; i++) {
				const button = buttons[i] as HTMLButtonElement;
				if (button.textContent === ".") {
					return button;
				}
			}
			throw new Error("Point button not found");
		}

		const pointButton = getPointButton();

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
		pointButton.click();
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

		expect(component.operation).toBe("plus");
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
		expect(component.operation).toBe("plus");
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
		expect(component.operation).toBe("minus");
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
		expect(component.operation).toBe("plus");
		expect(component.a).toBe("12");

		equalButton.click();

		fixture.detectChanges();
		await fixture.whenStable();

		calcResponse = {
			result: "24"
		};

		req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "plus",
			a: "12",
			b: "12"
		});
		req.flush(calcResponse);

		fixture.detectChanges();
		await fixture.whenStable();

		expect(result.value).toBe("24");
		expect(component.operation).toBe("plus");
		expect(component.a).toBe("24");
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

		let req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({
			operation: "divide",
			a: "1",
			b: "0"
		});

		req.flush("Division by zero", {
			status: 400,
			statusText: "Bad Request"
		});

		expect(window.alert).toHaveBeenCalledWith("Division by zero");

		fixture.detectChanges();
		await fixture.whenStable();

		expect(component.operation).toBe("divide");
		expect(component.a).toBe("1");
		expect(component.input).toBe("0");
	});
});

