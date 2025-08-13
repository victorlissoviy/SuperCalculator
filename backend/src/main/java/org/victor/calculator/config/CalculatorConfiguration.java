package org.victor.calculator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.victor.calculator.Calculator;

@Configuration
class CalculatorConfiguration {

	@Value("${operations.path}")
	private String operationsPath;

	@Bean
	public Calculator calculator() {
		Calculator calculator = new Calculator();
		calculator.setOperationsPath(operationsPath);
		calculator.loadOperations();

		return calculator;
	}
}
