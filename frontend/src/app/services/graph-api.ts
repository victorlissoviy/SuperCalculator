import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root"
})
export class GraphApi {
	private readonly baseUrl: string = "http://localhost:8080";

	constructor(private readonly http: HttpClient) {}

	public getGraph(func: string) {
		let request = {
			func: func
		};
		return this.http.post(`${this.baseUrl}/api/function`,
			request,
			{responseType: "blob"});
	}
}
