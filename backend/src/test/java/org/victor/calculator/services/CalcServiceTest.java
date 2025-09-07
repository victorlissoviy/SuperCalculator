package org.victor.calculator.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.victor.calculator.Calculator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CalcServiceTest {

	@Mock
	Calculator calculator;

	@InjectMocks
	CalcService service;

	@Test
	void testGetOperations() {
		when(calculator.getOperationsNames())
						.thenReturn(new String[] {"plus", "minus", "multi", "divide"});

		String[] operations = service.getOperations();
		assertNotNull(operations);
		assertEquals(4, operations.length);
		verify(calculator, times(1)).getOperationsNames();
	}

	@Test
	void testExecute() {
		when(calculator.execute("plus", "1", "2")).thenReturn("3");

		String result = service.execute("plus", "1", "2");
		assertEquals("3", result);

		verify(calculator, times(1)).execute("plus", "1", "2");
	}

	@Test
	void testDivideByZero() {
		when(calculator.execute("divide", "1", "0")).thenThrow(new ArithmeticException());

		assertThrows(ArithmeticException.class, () -> service.execute("divide", "1", "0"));
		verify(calculator, times(1)).execute("divide", "1", "0");
	}
}