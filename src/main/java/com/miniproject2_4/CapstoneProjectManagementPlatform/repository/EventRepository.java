package com.miniproject2_4.CapstoneProjectManagementPlatform.repository;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Event;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // from~to 구간과 '겹치는' 모든 이벤트 (스팬 케이스 포함)
    @Query("""
      select e
      from Event e
      where e.project.id = :projectId
        and (
              (e.startAt between :from and :to)
           or (e.endAt   between :from and :to)
           or (e.startAt <= :from and e.endAt >= :to)
        )
      order by e.startAt asc
    """)
    List<Event> findInRange(@Param("projectId") Long projectId,
                            @Param("from") LocalDateTime from,
                            @Param("to") LocalDateTime to);

    long countByProject_IdAndType(Long projectId, EventType type);

    List<Event> findByProject_IdOrderByStartAtAsc(Long projectId);

    // 파생 쿼리는 정렬 방향까지 명시해야 함 (Asc 누락 시 메서드 이름 오류)
    List<Event> findByProject_IdAndStartAtBetweenOrderByStartAtAsc(
            Long projectId,
            LocalDateTime from,
            LocalDateTime to
    );
}
