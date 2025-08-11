package org.victor.calculator.operations;

import java.math.BigDecimal;

public class Plus implements Operation {

	@Override
	public String execute(String a, String b) {
		BigDecimal aNumber = new BigDecimal(a);
		BigDecimal bNumber = new BigDecimal(b);
		return aNumber.add(bNumber).toPlainString();
	}

	@Override
	public String getName() {
		return "plus";
	}
}
