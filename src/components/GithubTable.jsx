import React, { useState, useEffect } from 'react';
import { GitBranch, FileText, Github } from 'lucide-react';

// Tailwind CSS를 사용하기 위해 CDN을 임포트합니다.
// 실제 프로젝트에서는 build 과정에서 처리합니다.
// 단일 파일로 구성된 React 앱이므로, <style> 태그에 직접 포함하는 것이 좋습니다.
// 하지만 컴포넌트가 JSX 내부에 있으므로, Tailwind 클래스명만 사용합니다.

// 이 컴포넌트는 GitHub 커밋 횟수를 가져와 표시하고, 관련 버튼을 렌더링하는 역할을 합니다.
const GithubTable = () => {
    // 상태 관리
    const [commitCount, setCommitCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // GitHub 리포지토리 정보
    // 사용자로부터 입력받을 경우 const githubRepoUrl =  githubUrl (다른 곳에서 전달된 값
    // const githubRepoUrl = `https://github.com/ratiorine1417/Capstone_Platform.git`

    useEffect(({ owner, repo }) => {
        // owner와 repo가 유효할 때만 API 호출
        if (!owner || !repo) {
            setCommitCount(null);
            setLoading(false);
            return;
        }

        const fetchCommitCount = async () => {
            setLoading(true);
            setError(null);

            try {
                // GitHub Search API를 사용하여 커밋 횟수를 가져옵니다.
                const response = await fetch(
                    `https://api.github.com/repos/ratiorine1417/Capstone_Platform/commits`
                );

                if (!response.ok) {
                    throw new Error(`GitHub API 호출 오류: ${response.statusText}`);
                }

                const data = await response.json();
                // 커밋 수 저장
                setCommitCount(data.length);
            } catch (err) {
                console.error("API 로드 오류:", err);
                setError("커밋 횟수를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchCommitCount();
    }, []);

    return (
        <div>
            <div className="p-2 bg-purple-200/50 rounded-lg dark:bg-purple-800/50">
                <GitBranch className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {loading ? (
                        '...'
                    ) : error ? (
                        <span className="text-red-500">오류</span>
                    ) : (
                        commitCount
                    )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">총 커밋 수</p>
            </div>
        </div>
    );
};

export default GithubTable;