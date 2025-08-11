package org.victor.calculator.exceptions;

public class OperationNotFoundException extends RuntimeException {
	public OperationNotFoundException(String message) {
		super(message);
	}
}
