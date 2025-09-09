// // src/components/projectList.jsx
// import React, { useState, useEffect } from 'react';
// import apiService from '../services/apiService';

// // projectRow 컴포넌트
// const projectRow = ({ project }) => {
//     return (
//         <tr>
//             <td>{project.title}</td>
//             <td>{project.author}</td>
//             <td>{project.year}</td>
//         </tr>
//     );
// };

// // projectList 컴포넌트
// const ProjectList = () => {
//     const [projects, setprojects] = useState([]); // 프로젝트 목록 상태
//     const [loading, setLoading] = useState(true); // 로딩 상태
//     const [error, setError] = useState(null); // 에러 상태

//     // 프로젝트 목록 로드 (useEffect, async/await)
//     useEffect(() => {
//         const fetchProjects = async () => {
//             console.log('프로젝트 목록 불러오는 중...');
//             try {
//                 const projectsData = await apiService.getprojects();
//                 console.log(`${projectsData.length}개의 프로젝트 데이터를 받았습니다.`);
//                 setprojects(projectsData); // 상태 업데이트
//             } catch (err) {
//                 console.error('목록 로드 오류:', err);
//                 setError('프로젝트 목록을 불러오는 데 실패했습니다.'); // 에러 상태 업데이트
//             } finally {
//                 setLoading(false); // 로딩 완료
//             }
//         };

//         fetchProjects();
//     }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행됨

//     // 렌더링 조건
//     if (loading) {
//         return <p>프로젝트 목록을 불러오는 중입니다...</p>;
//     }

//     if (error) {
//         return <p className="error-message">{error}</p>;
//     }

//     if (projects.length === 0) {
//         return <p>등록된 프로젝트가 없습니다.</p>;
//     }

//     // 성공적으로 데이터를 받은 경우 테이블 렌더링
//     return (
//         <table>
//             <thead>
//                 <tr>
//                     <th>제목</th>
//                     <th>저자</th>
//                     <th>출판 연도</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {/* map() 메서드를 사용하여 목록 렌더링 */}
//                 {projects.map((project) => (
//                     <projectRow key={project.id} project={project} />
//                 ))}
//             </tbody>
//         </table>
//     );
// };

// export default ProjectList;