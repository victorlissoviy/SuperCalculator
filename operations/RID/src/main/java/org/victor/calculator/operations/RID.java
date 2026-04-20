package org.victor.calculator.operations;

import java.math.BigDecimal;

public class RID implements Operation {
	@Override
	public String execute(String a, String b) {
		BigDecimal aNumber = new BigDecimal(a);
		BigDecimal bNumber = new BigDecimal(b);
		return aNumber.remainder(bNumber).toString();
	}

	@Override
	public String getName() {
		return "RID";
	}
}
