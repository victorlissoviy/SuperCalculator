package org.victor.calculator.operations;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PlusTest {

	@Test
	void testExecute() {
		Plus plus = new Plus();

		assertEquals("10", plus.execute("5", "5"));
		assertEquals("0.3", plus.execute("0.1", "0.2"));
		assertEquals("1.1", plus.execute("1", "0.1"));
		assertEquals("1.1", plus.execute("0.1", "1"));
		assertEquals("0.0", plus.execute("1.1", "-1.1"));
	}

	@Test
	void testGetName() {
		Plus plus = new Plus();

		assertEquals("plus", plus.getName());
	}

}