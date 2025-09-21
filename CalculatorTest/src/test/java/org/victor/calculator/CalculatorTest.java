package org.victor.calculator;

import org.junit.jupiter.api.Test;
import org.victor.calculator.exceptions.OperationNotFoundException;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

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

	@Test
	void testGetName() {
		Calculator calculator = new Calculator();
		calculator.setOperationsPath("../lib/SuperCalculator/operations");
		calculator.loadOperations();

		String[] names = calculator.getOperationsNames();

		assertNotNull(names);
		assertTrue(names.length >= 4);

		List<String> list = Arrays.asList(names);

		assertTrue(list.contains("plus"));
		assertTrue(list.contains("minus"));
		assertTrue(list.contains("multi"));
		assertTrue(list.contains("divide"));
	}

	@Test
	void testDivideByZero() {
		Calculator calculator = new Calculator();
		calculator.setOperationsPath("../lib/SuperCalculator/operations");
		calculator.loadOperations();

		assertThrows(ArithmeticException.class, () -> calculator.execute("divide", "1", "0"));
	}

	@Test
	void testSymbolEnter() {
		Calculator calculator = new Calculator();
		calculator.setOperationsPath("../lib/SuperCalculator/operations");
		calculator.loadOperations();

		assertThrows(NumberFormatException.class,
						() -> calculator.execute("divide", "b", "a"));
	}
}
