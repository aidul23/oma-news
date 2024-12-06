package threedots.dev_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class DevBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DevBackendApplication.class, args);
	}

	@GetMapping("/")
	public String apiRoot() {
		return "Oma News";
	}

}
