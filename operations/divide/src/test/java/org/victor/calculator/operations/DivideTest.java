package org.victor.calculator.operations;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DivideTest {

	@Test
	void testExecute() {
		Divide divide = new Divide();

		assertEquals("1", divide.execute("5", "5"));
		assertEquals("0.5", divide.execute("0.1", "0.2"));
		assertEquals("10", divide.execute("1", "0.1"));
		assertEquals("0.1", divide.execute("0.1", "1"));
		assertEquals("-1", divide.execute("1.1", "-1.1"));
		assertThrows(ArithmeticException.class,
						() -> divide.execute("1", "0"));
	}

	@Test
	void testGetName() {
		Divide divide = new Divide();

		assertEquals("divide", divide.getName());
	}

}