package org.victor.calculator.jarloaders;

import org.victor.calculator.exceptions.LoadOperationError;
import org.victor.calculator.operations.Operation;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Enumeration;
import java.util.Optional;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.logging.Logger;

public class JarLoaderImpl implements JarLoader {
	static Logger logger = Logger.getLogger(JarLoaderImpl.class.getName());

	@Override
	public Operation loadJar(File file) {
		JavaLoader loader = new JavaLoader(file);
		try {
			Operation operation = loader.loadJar();
			logger.fine("Operation loaded: " + operation.getName());
			return operation;
		} catch (IOException |
		         ClassNotFoundException |
		         InvocationTargetException |
		         InstantiationException |
		         IllegalAccessException |
		         NoSuchMethodException e) {
			throw new LoadOperationError("Error on load " + file.getName(), e);
		}
	}

	static class JavaLoader {
		private final File file;
		private URLClassLoader loader;

		public JavaLoader(File jarFile) {
			this.file = jarFile;
			this.init();
		}

		public Operation loadJar() throws
		                           IOException,
		                           ClassNotFoundException,
		                           NoSuchMethodException,
		                           InvocationTargetException,
		                           InstantiationException,
		                           IllegalAccessException {
			String canonicalPath = this.file.getCanonicalPath();
			Optional<Operation> operation = findOperationInFile(canonicalPath);

			if (operation.isEmpty()) {
				throw new LoadOperationError(
					"Not found operation in file " + canonicalPath);
			}

			return operation.get();
		}

		private Optional<Operation> findOperationInFile(String canonicalPath)
		throws
		IOException,
		ClassNotFoundException,
		InstantiationException,
		IllegalAccessException,
		InvocationTargetException,
		NoSuchMethodException {
			Optional<Operation> result = Optional.empty();
			try (JarFile jar = new JarFile(canonicalPath)) {
				String fineMessage = "Loading jar: %s".formatted(canonicalPath);
				logger.fine(fineMessage);
				Enumeration<JarEntry> entries = jar.entries();

				while (entries.hasMoreElements()) {
					JarEntry entry = entries.nextElement();

					Operation operation = getOperationFromEntity(entry);
					if (operation != null) {
						result = Optional.of(operation);
						break;
					}
				}
			}
			return result;
		}

		private Operation getOperationFromEntity(JarEntry entry) throws
		                                                         ClassNotFoundException,
		                                                         InstantiationException,
		                                                         IllegalAccessException,
		                                                         InvocationTargetException,
		                                                         NoSuchMethodException {
			if (checkIsNotClass(entry)) {
				return null;
			}

			Class<?> c = this.loadClass(entry);
			if (!checkAssignable(c)) {
				return null;
			}

			Object o = c.getDeclaredConstructor().newInstance();
			if (o instanceof Operation operation) {
				return operation;
			}
			return null;
		}

		private void init() {
			URL fileUrl = getURLFromFile(this.file);
			this.loader = new URLClassLoader(new URL[]{fileUrl});
		}

		private static URL getURLFromFile(File file) {
			try {
				URI uri = new URI("jar:file:" + file.getCanonicalPath() + "!/");
				return uri.toURL();
			} catch (Exception e) {
				throw new LoadOperationError("Error on load " + file.getName(), e);
			}
		}

		private static boolean checkIsNotClass(JarEntry je) {
			return je.isDirectory() || !je.getName().endsWith(".class");
		}

		private Class<?> loadClass(JarEntry je) throws
		                                        ClassNotFoundException {
			String className = getClassNameFromClass(je);
			return this.loader.loadClass(className);
		}

		private static String getClassNameFromClass(JarEntry je) {
			String className = je.getName();

			String fileMessage = "Loading class: %s".formatted(className);
			logger.fine(fileMessage);

			className = className.substring(0, className.length() - 6);
			className = className.replace('/', '.');
			return className;
		}

		private static boolean checkAssignable(Class<?> c) {
			return Operation.class.isAssignableFrom(c);
		}
	}
}
