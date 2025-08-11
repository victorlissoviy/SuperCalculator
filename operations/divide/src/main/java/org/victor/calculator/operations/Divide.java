package org.victor.calculator.operations;

import java.math.BigDecimal;
import java.math.MathContext;

public class Divide implements Operation {

	@Override
	public String execute(String a, String b) {
		BigDecimal aNumber = new BigDecimal(a);
		BigDecimal bNumber = new BigDecimal(b);
		return aNumber.divide(bNumber, MathContext.DECIMAL128).toPlainString();
	}

	@Override
	public String getName() {
		return "divide";
	}
}
