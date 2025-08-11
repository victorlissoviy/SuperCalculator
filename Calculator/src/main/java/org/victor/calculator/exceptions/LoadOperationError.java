package org.victor.calculator.exceptions;

public class LoadOperationError extends RuntimeException {
	public LoadOperationError(String message, Throwable cause) {
		super(message, cause);
	}
}
