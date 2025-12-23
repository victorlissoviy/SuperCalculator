import { Component, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GraphApi } from "../services/graph-api";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
	selector: "app-graph",
	imports: [
		FormsModule
	],
	templateUrl: "./graph.html",
	styleUrl: "./graph.scss",
	standalone: true
})
export class Graph implements OnDestroy {
	protected input: string = "";
	protected isImage: boolean = false;
	protected imagePath: SafeUrl | null = null;
	private rawUrl: string | null = null;

	constructor(private readonly api: GraphApi,
	            private readonly sanitizer: DomSanitizer) {}

	ngOnDestroy(): void {
		if (this.rawUrl != null) {
			this.isImage = false;
			URL.revokeObjectURL(this.rawUrl);
		}
	}

	protected drawImg() {
		let line = this.input;
		if (line == "") {
			return;
		}

		this.api.getGraph(line).subscribe({
			next: data => {
				this.rawUrl = URL.createObjectURL(data);

				this.imagePath = this.sanitizer.bypassSecurityTrustUrl(this.rawUrl);
				this.isImage = true;
			},
			error: alert
		});
	}
}
