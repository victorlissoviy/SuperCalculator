package org.victor.calculator.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.victor.calculator.Calculator;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ActiveProfiles("test")
@SpringBootTest
class CalculatorConfigurationTest {

	@Autowired
	CalculatorConfiguration calculatorConfiguration;

	@Test
	void testCalculatorConfiguration() {
		assertNotNull(calculatorConfiguration);

		Calculator calculator = calculatorConfiguration.calculator();

		assertNotNull(calculator);

		String[] operations = calculator.getOperationsNames();

		assertNotNull(operations);
		assertTrue(operations.length >= 4);

		Set<String> set = new HashSet<>(Arrays.asList(operations));

		assertTrue(set.contains("plus"));
		assertTrue(set.contains("minus"));
		assertTrue(set.contains("multi"));
		assertTrue(set.contains("divide"));
	}
}