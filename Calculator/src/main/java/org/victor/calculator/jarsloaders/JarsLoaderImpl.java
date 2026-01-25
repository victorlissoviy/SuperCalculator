package org.victor.calculator.jarsloaders;

import org.victor.calculator.jarloaders.JarLoader;
import org.victor.calculator.jarloaders.JarLoaderImpl;
import org.victor.calculator.operations.Operation;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class JarsLoaderImpl implements JarsLoader {
	private final Map<String, Operation> operations = new HashMap<>();
	private final JarLoader jarLoader = new JarLoaderImpl();

	@Override
	public Map<String, Operation> loadJars(File[] files) {
		this.loadJarsFromFiles(files);
		return this.operations;
	}

	private void loadJarsFromFiles(File[] files) {

		for (File file: files) {
			Operation operation = jarLoader.loadJar(file);
			this.addOperation(operation.getName(), operation);
		}
	}

	public void addOperation(String name, Operation operation) {
		this.operations.put(name, operation);
	}
}
