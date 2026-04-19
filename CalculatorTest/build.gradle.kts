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
	testImplementation(project(":operations:plus"))
	testImplementation(project(":operations:minus"))
	testImplementation(project(":operations:multi"))
	testImplementation(project(":operations:divide"))
	testImplementation(platform("org.junit:junit-bom:5.10.0"))
	testImplementation("org.junit.jupiter:junit-jupiter")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
	useJUnitPlatform()
}
