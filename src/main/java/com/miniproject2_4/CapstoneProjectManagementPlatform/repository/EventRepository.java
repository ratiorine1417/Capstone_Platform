package com.miniproject2_4.CapstoneProjectManagementPlatform.repository;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.EventType;

public interface EventRepository extends JpaRepository<Event, Long> {

    // from~to 구간과 '겹치는' 모든 이벤트(시작/끝이 범위 안이거나, 아예 범위를 덮는 케이스까지)
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

    // 시작 시간이 범위 안인 이벤트(스팬 케이스는 빠질 수 있음)
    List<Event> findByProject_IdAndStartAtBetweenOrderByStartAt(
            Long projectId,
            LocalDateTime from,
            LocalDateTime to
    );
}
