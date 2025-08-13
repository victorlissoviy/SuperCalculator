package org.victor.calculator.services;

import org.springframework.stereotype.Service;
import org.victor.calculator.Calculator;

@Service
public class CalcService {

	private final Calculator calculator;

	CalcService(Calculator calculator) {
		this.calculator = calculator;
	}

	public String[] getOperations() {
		return calculator.getOperationsNames();
	}

	public String execute(String operation, String a, String b) {
		return calculator.execute(operation, a, b);
	}
}
