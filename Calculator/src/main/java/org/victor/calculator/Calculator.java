package org.victor.calculator;

import org.victor.calculator.exceptions.LoadOperationError;
import org.victor.calculator.exceptions.OperationNotFoundException;
import org.victor.calculator.exceptions.OperationsNotFound;
import org.victor.calculator.operations.Operation;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.logging.Logger;

/**
 * Calculator class.
 *
 * @author Victor
 */
public class Calculator {

	/**
	 * Default logger.
	 */
	private Logger logger = Logger.getLogger(this.getClass().getName());

	/**
	 * Path to operations.
	 */
	private Path operationsPath = Path.of("../lib/SuperCalculator/operations");

	private final HashMap<String, Operation> operations = new HashMap<>();

	Calculator() {
	}

	public void loadOperations() {
		File dir = operationsPath.toFile();
		if (!dir.exists()) {
			throw new OperationsNotFound("Directory operations does not exist : " + operationsPath.toAbsolutePath());
		}
		File[] files = dir.listFiles();
		if (files == null || files.length == 0) {
			throw new OperationsNotFound("Operations in path %s not found".formatted(operationsPath.toAbsolutePath()));
		}

		loadJars(files);
	}

	private URL getURIFromFile(File file) {
		try {
			URI uri = new URI("jar:file:" + file.getCanonicalPath() + "!/");
			return uri.toURL();
		} catch (Exception e) {
			throw new LoadOperationError("Error on load " + file.getName(), e);
		}
	}

	private void loadJars(File[] files) {
		URL[] urls = Arrays.stream(files).map(this::getURIFromFile).toArray(URL[]::new);
		try (URLClassLoader cl = URLClassLoader.newInstance(urls)) {
			for (File file : files) {
				loadJarFile(file, cl);
			}
		} catch (IOException e) {
			throw new LoadOperationError("Error on load jar", e);
		}
	}

	private void loadJarFile(File file, URLClassLoader cl) {
		try (JarFile jar = new JarFile(file.getCanonicalPath())) {
			logger.fine("Loading jar: " + file.getCanonicalFile());
			Enumeration<JarEntry> e = jar.entries();

			while (e.hasMoreElements()) {
				JarEntry je = e.nextElement();
				if (je.isDirectory() || !je.getName().endsWith(".class")) {
					continue;
				}
				logger.fine("Loading class: " + je.getName());
				String className = je.getName().substring(0, je.getName().length() - 6);
				className = className.replace('/', '.');
				Class<?> c = cl.loadClass(className);

				if (Operation.class.isAssignableFrom(c)) {
					Object o = c.getDeclaredConstructor().newInstance();
					if (o instanceof Operation operation) {
						addOperation(operation.getName(), operation);
					}
				}

			}
		} catch (IOException | ClassNotFoundException | InstantiationException |
		         IllegalAccessException | InvocationTargetException |
		         NoSuchMethodException e) {
			throw new LoadOperationError("Error on load " + file.getName(), e);
		}
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
		Operation operation = operations.get(operationName);
		if (operation == null) {
			throw new OperationNotFoundException("Operation %s not found".formatted(operationName));
		}
		return operation.execute(a, b);
	}

	public void addOperation(String name, Operation operation) {
		operations.put(name, operation);
	}

	public Map<String, Operation> getOperations() {
		return new HashMap<>(this.operations);
	}

	public Logger getLogger() {
		return logger;
	}

	public void setLogger(Logger logger) {
		this.logger = logger;
	}

	public Path getOperationsPath() {
		return operationsPath;
	}

	public void setOperationsPath(String operationsPath) {
		this.operationsPath = Path.of(operationsPath);
	}
}