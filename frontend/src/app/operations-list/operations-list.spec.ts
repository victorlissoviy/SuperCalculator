import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OperationsList } from "./operations-list";
import {
	HttpTestingController,
	provideHttpClientTesting
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

describe("OperationsList", () => {
	let fixture: ComponentFixture<OperationsList>;
	let component: OperationsList;
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
			imports: [OperationsList]
		}).compileComponents();

		fixture = TestBed.createComponent(OperationsList);
		component = fixture.componentInstance;
		compiled = fixture.nativeElement as HTMLElement;

		httpMock = TestBed.inject(HttpTestingController);

		fixture.detectChanges();

		const req = httpMock.expectOne(baseUrl + "/calc");
		expect(req.request.method).toBe("GET");

		req.flush(mockResponse);

		fixture.detectChanges();
	});

	afterEach(() => {
		httpMock.verify();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should render the list of operations", async () => {
		const list = compiled.querySelectorAll(".operation");

		expect(list.length).toBe(mockResponse.length);
	});

	it("should emit the operation when clicked", async () => {
		spyOn(component.clickOperation, "emit");

		const plusButton = compiled.querySelector(".operation") as HTMLButtonElement;
		plusButton.click();

		fixture.detectChanges();

		expect(component.clickOperation.emit).toHaveBeenCalledWith("plus");
	})
});
