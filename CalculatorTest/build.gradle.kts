plugins {
	id("java")
}

group = "org.victor"
version = "latest"

repositories {
	mavenCentral()
}

dependencies {
	testImplementation(project(":Calculator"))
	testImplementation(platform("org.junit:junit-bom:5.10.0"))
	testImplementation("org.junit.jupiter:junit-jupiter")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
	useJUnitPlatform()

	dependsOn(
		":operations:plus:copyJar",
		":operations:minus:copyJar",
		":operations:multi:copyJar",
		":operations:divide:copyJar"
	)
}
