package org.victor.calculator;

import org.victor.calculator.exceptions.OperationNotFoundException;
import org.victor.calculator.exceptions.OperationsNotFound;
import org.victor.calculator.jarsloaders.JarsLoader;
import org.victor.calculator.jarsloaders.JarsLoaderImpl;
import org.victor.calculator.operations.Operation;

import java.io.File;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Calculator class.
 *
 * @author Victor
 */
public class Calculator {

	private Logger logger = Logger.getLogger(this.getClass().getName());
	private Path operationsPath = Path.of("../lib/SuperCalculator/operations");
	private Map<String, Operation> operations = new HashMap<>();

	public void loadOperations() {
		File dir = operationsPath.toFile();
		this.checkDir(dir);
		File[] files = this.getJarFiles(dir);

		JarsLoader jarsLoader = new JarsLoaderImpl();
		this.operations = jarsLoader.loadJars(files);
	}

	private void checkDir(File dir) {
		if (!dir.exists() || !dir.isDirectory()) {
			String message = "Directory operations does not exist: %s"
							.formatted(operationsPath.toAbsolutePath());
			throw new OperationsNotFound(message);
		}
	}

	private File[] getJarFiles(File dir) {
		File[] files = dir.listFiles();
		if (files == null || files.length == 0) {
			String message = "Operations in path %s not found"
							.formatted(operationsPath.toAbsolutePath());
			throw new OperationsNotFound(message);
		}
		return files;
	}

	/**
	 * Execute operation.
	 *
	 * @param operationName operation name
	 * @param a             first operand
	 * @param b             second operand
	 * @return result of operation
	 */
	public String execute(String operationName, String a, String b) {
		Operation operation = this.getOperation(operationName);
		return operation.execute(a, b);
	}

	private Operation getOperation(String operationName) {
		Operation operation = this.operations.get(operationName);
		if (operation == null) {
			throw new OperationNotFoundException("Operation %s not found".formatted(operationName));
		}
		return operation;
	}

	public String[] getOperationsNames() {
		return this.operations.keySet().toArray(String[]::new);
	}

	public Map<String, Operation> getOperations() {
		return new HashMap<>(this.operations);
	}

	public Logger getLogger() {
		return this.logger;
	}

	public void setLogger(Logger logger) {
		this.logger = logger;
	}

	public Path getOperationsPath() {
		return this.operationsPath;
	}

	public void setOperationsPath(String operationsPath) {
		this.operationsPath = Path.of(operationsPath);
	}
}
