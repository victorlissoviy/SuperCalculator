package org.victor.calculator.operations;

import java.math.BigDecimal;
import java.math.MathContext;

public class Multi implements Operation {

	@Override
	public String execute(String a, String b) {
		BigDecimal aNumber = new BigDecimal(a);
		BigDecimal bNumber = new BigDecimal(b);
		return aNumber.multiply(bNumber, MathContext.DECIMAL128).toPlainString();
	}

	@Override
	public String getName() {
		return "multi";
	}
}
