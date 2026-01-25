package org.victor.calculator.jarsloaders;

import org.victor.calculator.operations.Operation;

import java.io.File;
import java.util.Map;

public interface JarsLoader {
	Map<String, Operation> loadJars(File[] files);
}
