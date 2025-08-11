package org.victor.calculator;

import org.junit.jupiter.api.Test;
import org.victor.calculator.exceptions.OperationNotFoundException;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

	@Test
	void testLogger() {
		Calculator calculator = new Calculator();

		assertNotNull(calculator.getLogger());

		calculator.setLogger(null);

		assertNull(calculator.getLogger());
	}

	@Test
	void testOperationPath() {
		Calculator calculator = new Calculator();

		Path localPath = Path.of(".");

		calculator.setOperationsPath(".");

		assertEquals(calculator.getOperationsPath(), localPath);
	}

	@Test
	void testLoadOperations() {
		Calculator calculator = new Calculator();
		calculator.setOperationsPath("../lib/SuperCalculator/operations");
		calculator.loadOperations();

		assertNotNull(calculator.getOperations());
	}

	@Test
	void testExecuteWithException() {
		Calculator calculator = new Calculator();
		calculator.setOperationsPath("../lib/SuperCalculator/operations");
		calculator.loadOperations();

		assertThrows(OperationNotFoundException.class,
						() -> calculator.execute("la", "1", "0"));
	}

	@Test
	void testExecute() {
		Calculator calculator = new Calculator();
		calculator.setOperationsPath("../lib/SuperCalculator/operations");
		calculator.loadOperations();

		assertEquals("1.1", calculator.execute("plus", "1", "0.1"));
	}
}
