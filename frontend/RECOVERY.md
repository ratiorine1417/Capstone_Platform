# 🚑 빠른 복구 매뉴얼 (북마크용)

## 깨진다 싶으면 항상 이 순서

```bash
# 1. 완전 초기화
rm -rf node_modules package-lock.json
npm cache clean --force

# 2. 재설치 
npm i

# 3. import 정리
npm run fix:imports

# 4. 의존성 검증
npm run verify:radix

# 5. 개발 서버 시작
npm run dev
```

## 주요 규칙

### ✅ 경로 별칭만 사용
- `@/lib/utils` ✅
- `@/components/...` ✅  
- `src/lib/utils` ❌
- `./utils` ❌

### ✅ 라이브러리 업데이트 시 주의사항
- react-day-picker, date-fns 등 루트 라이브러리 업데이트 전에 서로 호환 범위 먼저 확인
- 업데이트 후 반드시 `npm run verify:radix` 실행

### ✅ 팀 환경 통일
- Node.js 18 사용 (`.nvmrc` 확인)
- npm만 사용 (yarn, pnpm 금지)
- `package-lock.json` 커밋 필수

## 에러별 대응법

### "Failed to resolve import @radix-ui/..."
```bash
npm run fix:imports
```

### 버전 충돌 에러
```bash
rm -rf node_modules package-lock.json
npm i --legacy-peer-deps
```

### CI에서 깨질 때
```bash
npm run fix:imports && npm run verify:radix
```

## 검증 스크립트
- `npm run fix:imports`: import 경로 정리
- `npm run verify:radix`: Radix 의존성 확인