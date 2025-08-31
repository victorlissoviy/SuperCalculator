import { TestBed } from "@angular/core/testing";

import { CalcApi } from "./calc-api";
import { provideHttpClient } from "@angular/common/http";
import {
	HttpTestingController,
	provideHttpClientTesting
} from "@angular/common/http/testing";
import { CalcResponse } from "../interfaces/CalcResponse";
import { CalcRequest } from "../interfaces/CalcRequest";

describe("CalcApi", () => {
	let service: CalcApi;
	let httpMock: HttpTestingController;

	let baseUrl = "http://localhost:8080";

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CalcApi,
				provideHttpClient(),
				provideHttpClientTesting()
			]
		});
		service = TestBed.inject(CalcApi);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should return operations", () => {
		const mockResponse: string[] = ["plus", "minus", "multi", "divide"];

		service.getOperations().subscribe((response: string[]) => {
			expect(response).toEqual(mockResponse);
		});

		const req = httpMock.expectOne(baseUrl + "/calc");
		expect(req.request.method).toBe("GET");
		req.flush(mockResponse);
	});

	it("should return result", () => {
		const mockResponse: CalcResponse = {
			result: "0.3"
		};

		const request: CalcRequest = {
			operation: "plus",
			a: "0.1",
			b: "0.2"
		};

		service.execute("plus", "0.1", "0.2").subscribe((value: CalcResponse) => {
			expect(value).toEqual(mockResponse);
		});

		const req = httpMock.expectOne(baseUrl + "/calc/execute");
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual(request);
		req.flush(mockResponse);
	});
});
