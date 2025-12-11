plugins {
	// Apply the application plugin to add support for building a CLI application in Java.
	id("java")
}

// Apply a specific Java toolchain to ease working on different environments.
java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(25)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation(project(":Calculator"))
	testImplementation(platform("org.junit:junit-bom:5.10.0"))
	testImplementation("org.junit.jupiter:junit-jupiter")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
	useJUnitPlatform()
}

tasks.register<Copy>("copyJar") {
	description = "Copies the jar to the SuperCalculator/operations folder"
	group = "build"
	dependsOn(tasks.named<Jar>("jar"))
	from(tasks.named<Jar>("jar").get().archiveFile)
	into("../../lib/SuperCalculator/operations")
}

tasks.named("build") {
	dependsOn("copyJar")
}

tasks.named("test") {
	dependsOn("copyJar")
}