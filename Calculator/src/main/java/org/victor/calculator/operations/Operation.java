package org.victor.calculator.operations;

/**
 * Operation interface.
 * Each operation must implement this interface.
 *
 * @author Victor
 */
public interface Operation {
	String execute(String a, String b);

	String getName();
}
