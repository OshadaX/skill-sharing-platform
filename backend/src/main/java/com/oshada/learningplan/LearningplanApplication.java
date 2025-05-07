package com.oshada.learningplan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LearningPlanApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearningPlanApplication.class, args);
	}

}
