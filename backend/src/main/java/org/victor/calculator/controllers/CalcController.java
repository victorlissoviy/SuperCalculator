package org.victor.calculator.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.victor.calculator.exceptions.OperationNotFoundException;
import org.victor.calculator.operations.OperationRequestBody;
import org.victor.calculator.operations.OperationResponse;
import org.victor.calculator.services.CalcService;

@RestController
@RequestMapping("/")
class CalcController {

	private final CalcService service;

	CalcController(CalcService service) {
		this.service = service;
	}

	@GetMapping("/calc")
	public ResponseEntity<String[]> getOperationsNames() {
		return ResponseEntity.ok(service.getOperations());
	}

	@PostMapping("/calc/execute")
	public ResponseEntity<OperationResponse> execute(
					@RequestBody(required = false) OperationRequestBody operation) {
		String result = service.execute(operation.getOperation(),
						operation.getA(),
						operation.getB());
		OperationResponse response = new OperationResponse();
		response.setResult(result);
		return ResponseEntity.ok(response);
	}

	@ExceptionHandler(ArithmeticException.class)
	public ResponseEntity<String> handleException(ArithmeticException ex) {
		return ResponseEntity.badRequest().body(ex.getMessage());
	}

	@ExceptionHandler(NumberFormatException.class)
	public ResponseEntity<String> handleException(NumberFormatException ex) {
		return ResponseEntity.badRequest().body(ex.getMessage());
	}

	@ExceptionHandler(OperationNotFoundException.class)
	public ResponseEntity<String> handleException(OperationNotFoundException ex) {
		return ResponseEntity.badRequest().body(ex.getMessage());
	}
}
