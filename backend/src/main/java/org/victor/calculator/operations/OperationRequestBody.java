package org.victor.calculator.operations;

public class OperationRequestBody {
	private String operation;
	private String a;
	private String b;

	public String getOperation() {
		return operation;
	}

	public String getA() {
		return a;
	}

	public String getB() {
		return b;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public void setA(String a) {
		this.a = a;
	}

	public void setB(String b) {
		this.b = b;
	}

	@Override
	public String toString() {
		return "{\"operation\":\"" + operation + "\","
				+ "\"a\":\"" + a + "\","
				+ "\"b\":\"" + b + "\"}";
	}
}
