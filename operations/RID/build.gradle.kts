plugins {
	id("java")
}

group = "org.victor.calculator.operations"
version = "unspecified"

repositories {
	mavenCentral()
}

dependencies {
	implementation(project(":Calculator"))
	testImplementation(platform("org.junit:junit-bom:6.0.0"))
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
