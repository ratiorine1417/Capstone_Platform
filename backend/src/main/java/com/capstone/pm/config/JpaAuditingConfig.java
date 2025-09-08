package com.capstone.pm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    // 필요한 경우 AuditorAware 구현을 여기서 @Bean으로 등록
}