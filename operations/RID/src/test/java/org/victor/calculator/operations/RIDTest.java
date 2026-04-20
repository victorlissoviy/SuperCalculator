package org.victor.calculator.operations;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RIDTest {

	@Test
	void testExecute() {
		RID rid = new RID();
		assertEquals("0", rid.execute("1", "1"));
		assertEquals("2", rid.execute("5", "3"));
		assertEquals("-2", rid.execute("-5", "3"));
		assertEquals("-2", rid.execute("-5", "-3"));
		assertEquals("2", rid.execute("5", "-3"));

		assertEquals("1", rid.execute("1", "2"));
		assertEquals("0", rid.execute("2", "2"));
		assertEquals("1", rid.execute("3", "2"));
		assertEquals("0", rid.execute("4", "2"));
		assertEquals("1", rid.execute("5", "2"));
	}

	@Test
	void testGetName() {
		RID rid = new RID();
		assertEquals("RID", rid.getName());
	}
}
