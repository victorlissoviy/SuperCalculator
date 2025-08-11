package org.victor.calculator.operations;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MultiTest {

	@Test
	void testExecute() {
		Multi multi = new Multi();

		assertEquals("25", multi.execute("5", "5"));
		assertEquals("0.02", multi.execute("0.1", "0.2"));
		assertEquals("0.1", multi.execute("1", "0.1"));
		assertEquals("0.1", multi.execute("0.1", "1"));
		assertEquals("-1.21", multi.execute("1.1", "-1.1"));
	}

	@Test
	void testGetName() {
		Multi multi = new Multi();

		assertEquals("multi", multi.getName());
	}

}