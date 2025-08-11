package org.victor.calculator.operations;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MinusTest {

	@Test
	void testExecute() {
		Minus minus = new Minus();

		assertEquals("0", minus.execute("5", "5"));
		assertEquals("-0.1", minus.execute("0.1", "0.2"));
		assertEquals("0.9", minus.execute("1", "0.1"));
		assertEquals("-0.9", minus.execute("0.1", "1"));
		assertEquals("2.2", minus.execute("1.1", "-1.1"));
	}

	@Test
	void testGetName() {
		Minus minus = new Minus();

		assertEquals("minus", minus.getName());
	}

}