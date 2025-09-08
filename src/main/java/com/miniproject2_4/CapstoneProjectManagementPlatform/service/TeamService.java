// src/main/java/com/miniproject2_4/CapstoneProjectManagementPlatform/service/TeamService.java
package com.miniproject2_4.CapstoneProjectManagementPlatform.service;

import com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto.TeamListDto;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.*;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.AssignmentRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.EventRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.ProjectRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.TeamMemberRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ProjectRepository projectRepository;
    private final AssignmentRepository assignmentRepository;
    private final EventRepository eventRepository;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    /** /api/teams */
    public List<TeamListDto> listTeams() {
        return teamRepository.findAll().stream().map(team -> {
            // 프로젝트명
            String projectTitle = projectRepository.findByTeam_Id(team.getId())
                    .map(Project::getTitle)
                    .orElse("미배정 프로젝트");

            // 팀 멤버 전체 조회 (역할로 필터링하지 않고 이후에 구분)
            var teamMembers = teamMemberRepository.findWithUserByTeamId(team.getId());

            // 리더 1명 선택: String 역할을 enum 으로 변환해서 비교
            Optional<TeamListDto.Person> leaderOpt = teamMembers.stream()
                    .filter(tm -> toRole(tm.getRoleInTeam()) == TeamRole.LEADER)
                    .findFirst()
                    .map(tm -> new TeamListDto.Person(
                            tm.getUser().getName(),
                            tm.getUser().getEmail(),
                            null // avatar
                    ));

            TeamListDto.Person leader = leaderOpt.orElse(null);

            // 멤버 DTO 변환 (enum -> 프론트 문자열로 매핑)
            List<TeamListDto.Member> members = teamMembers.stream()
                    .map(tm -> {
                        TeamRole role = toRole(tm.getRoleInTeam()); // String/Enum 혼용 안전 처리
                        String roleStr = (role == TeamRole.LEADER) ? "leader" : "member";
                        return new TeamListDto.Member(
                                tm.getUser().getId(),
                                tm.getUser().getName(),
                                tm.getUser().getEmail(),
                                null,        // avatar
                                roleStr,     // 'leader' | 'member'
                                "active"     // 별도 상태 없음 → 임시값
                        );
                    })
                    .toList();

            // 통계(회의/과제)
            Long projectId = projectRepository.findByTeam_Id(team.getId())
                    .map(Project::getId)
                    .orElse(null);

            int meetings = 0;
            int totalTasks = 0;
            int completedTasks = 0;
            if (projectId != null) {
                meetings = (int) eventRepository.countByProject_IdAndType(projectId, EventType.MEETING);
                totalTasks = (int) assignmentRepository.countByProject_Id(projectId);
                completedTasks = (int) assignmentRepository.countByProject_IdAndStatus(projectId, AssignmentStatus.COMPLETED);
            }

            TeamListDto.Stats stats = new TeamListDto.Stats(
                    0, // 커밋 집계 소스 없음 → 0
                    meetings,
                    new TeamListDto.Tasks(completedTasks, totalTasks)
            );

            String createdAt = team.getCreatedAt() != null ? team.getCreatedAt().format(ISO) : null;
            String lastActivity = team.getUpdatedAt() != null ? team.getUpdatedAt().format(ISO) : createdAt;

            return new TeamListDto(
                    team.getId(),
                    team.getName(),
                    projectTitle,
                    "팀 소개가 없습니다.",
                    leader,
                    members,
                    stats,
                    createdAt,
                    lastActivity
            );
        }).toList();
    }

    /**
     * TeamMember.roleInTeam 가 String/Enum 어느 쪽이든 안전하게 TeamRole로 변환
     */
    private static TeamRole toRole(Object raw) {
        if (raw == null) return TeamRole.MEMBER;
        if (raw instanceof TeamRole r) return r;
        if (raw instanceof String s) {
            try {
                return TeamRole.valueOf(s);
            } catch (IllegalArgumentException ignore) {
                // 알 수 없는 문자열이면 기본값
            }
        }
        return TeamRole.MEMBER;
    }
}
