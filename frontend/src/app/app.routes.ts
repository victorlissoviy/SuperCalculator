import { Routes } from "@angular/router";
import { Calculator } from "./calculator/calculator";

export const routes: Routes = [
	{path: "", component: Calculator, pathMatch: "full"},
	{path: "**", redirectTo: ""}
];
