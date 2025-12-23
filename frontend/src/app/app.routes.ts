import { Routes } from "@angular/router";
import { Calculator } from "./calculator/calculator";
import { Graph } from "./graph/graph";

export const routes: Routes = [
	{path: "", component: Calculator, pathMatch: "full"},
	{path: "graph", component: Graph},
	{path: "**", redirectTo: ""}
];
