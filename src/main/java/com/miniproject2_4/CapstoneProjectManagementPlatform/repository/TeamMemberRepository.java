package com.miniproject2_4.CapstoneProjectManagementPlatform.repository;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.TeamMember;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.TeamMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, TeamMemberId> {

    // TeamService.listTeams()가 호출
    List<TeamMember> findByTeam_Id(Long teamId);

    // DashboardService.getSummary()가 호출
    long countByTeam_Id(Long teamId);

    // 성능 개선용: 유저를 함께 로딩 (원하면 TeamService에서 이 메서드로 교체)
    @Query("""
       select tm from TeamMember tm
       join fetch tm.user u
       where tm.team.id = :teamId
    """)
    List<TeamMember> findWithUserByTeamId(@Param("teamId") Long teamId);
}
