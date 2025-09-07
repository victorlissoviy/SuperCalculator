package org.victor.calculator.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.victor.calculator.operations.OperationRequestBody;
import org.victor.calculator.operations.OperationResponse;
import org.victor.calculator.services.CalcService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(CalcController.class)
class CalcControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private CalcService service;

	@Test
	void testGetOperations() throws Exception {
		when(service.getOperations())
						.thenReturn(new String[]{"plus", "minus", "multi", "divide"});

		mockMvc.perform(get("/calc"))
						.andExpect(status().isOk())
						.andExpect(result ->
										assertEquals("[\"plus\",\"minus\",\"multi\",\"divide\"]",
														result.getResponse().getContentAsString()));

	}

	@Test
	void testExecute() throws Exception {
		when(service.execute("plus", "1", "2"))
						.thenReturn("3");

		OperationRequestBody body = new OperationRequestBody();
		body.setOperation("plus");
		body.setA("1");
		body.setB("2");

		OperationResponse response = new OperationResponse();
		response.setResult("3");

		mockMvc.perform(post("/calc/execute")
										.contentType(MediaType.APPLICATION_JSON)
										.content(body.toString()))
				.andExpect(status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.result")
						.value(response.getResult()));
	}

	@Test
	void testDivideByZero() throws Exception {
		when(service.execute("divide", "1", "0"))
						.thenThrow(new ArithmeticException());

		OperationRequestBody body = new OperationRequestBody();
		body.setOperation("divide");
		body.setA("1");
		body.setB("0");

		mockMvc.perform(post("/calc/execute")
										.contentType(MediaType.APPLICATION_JSON)
										.content(body.toString()))
				.andExpect(status().isBadRequest());

		verify(service, times(1)).execute("divide", "1", "0");
	}
}