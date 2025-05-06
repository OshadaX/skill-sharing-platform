package com.oshada.learningplan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "*")
public class LearningplanApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearningplanApplication.class, args);
	}

}
