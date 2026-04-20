import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class GraphApi {
	private readonly baseUrl: string = environment.baseGraphUrl;

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
