package org.victor.calculator.jarloaders;

import org.victor.calculator.operations.Operation;

import java.io.File;

public interface JarLoader {
	Operation loadJar(File file);
}
