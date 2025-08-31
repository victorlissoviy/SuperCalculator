import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CalcRequest } from "../interfaces/CalcRequest";
import { CalcResponse } from "../interfaces/CalcResponse";

@Injectable({
	providedIn: "root"
})
export class CalcApi {
	baseUrl: string = "http://localhost:8080";

	constructor(private readonly http: HttpClient) {}

	getOperations() {
		return this.http.get<string[]>(`${this.baseUrl}/calc`);
	}

	execute(operation: string, a: string, b: string) {
		const request: CalcRequest = {
			operation: operation,
			a: a,
			b: b
		};
		return this.http.post<CalcResponse>(`${this.baseUrl}/calc/execute`, request);
	}
}
