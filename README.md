# Steven Log

AI에 대한 생각과 소프트웨어 개발 기록을 위한 개인 블로그.

- 운영 예정 주소: https://steven-log.home201.com
- Astro + TypeScript + MDX, 정적 빌드
- 하늘색 포인트와 글 중심의 미니멀 UI
- 댓글: Giscus (동일 공개 저장소의 Discussions에 연결)
- 배포 목표: Docker → Zot → infra Kustomize → ArgoCD. Vercel 사용 안 함.
- 별도 상시 dev 배포 환경 없이 로컬 + 운영으로 구성

## 로컬 개발

Node.js 24 이상 권장.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## 글 작성

`src/content/posts/`에 `.md` 또는 `.mdx` 파일을 추가한다.
필수 메타데이터: `title`, `description`, `date`, `category` (`생각` 또는 `기술`).
선택: `tags`, `draft`. 날짜는 `YYYY-MM-DD` 또는 시간대가 있는 ISO 형식.

초안은 `draft: true`. 개발 서버에서만 표시하고 운영 빌드·RSS·사이트맵에서 제외한다.
미래 날짜 글도 운영 빌드에서 제외하며, 날짜가 되어도 자동 발행되지 않는다. 재빌드·배포가 필요하다.
`preview.mdx`는 화면 검증용이며 Steven의 실제 글이 아니다.

## Giscus

`steven-labs/steven-log`는 공개 저장소이며 Giscus 앱 설치와 Discussions 활성화를 완료했다.
댓글은 `Announcements` 카테고리에 저장하고 글의 pathname으로 연결한다.
공개 식별자는 `src/config/giscus.ts`에 있으므로 기본 빌드·Docker 빌드에 별도 시크릿이나 환경변수가 필요 없다.
필요하면 `.env.example`에 있는 `PUBLIC_GISCUS_*` 값으로 재정의할 수 있다.
Docker 재정의는 같은 이름의 `--build-arg`로 전달한다. 공개 식별자이며 인증 토큰을 넣지 않는다.
초안에는 댓글 창을 표시하지 않는다. 댓글 쓰기는 GitHub 로그인이 필요하다.
글 URL을 바꾸면 연결되는 토론도 달라지므로 발행 후 slug는 유지한다.
운영 미배포 상태라 운영 도메인에서의 실제 댓글 작성은 아직 검증하지 않았다.

## 운영 배포 (아직 미연결)

`docker/Dockerfile`로 정적 사이트를 빌드하고 비루트 Nginx의 8080 포트에서 제공한다.
`/healthz`는 프로브용이다. release 태그 기반 Zot 푸시와 infra 갱신은 기존 home201 패턴을 따른다.
infra 접근이 없어 K8s manifest·Ingress·TLS·CI 자격증명은 아직 확인/적용하지 않았다.
현재 GitHub Actions는 빌드 검증만 수행하며 자동 운영 배포하지 않는다.

## 다음 작업

- UI 세부 조정 및 검색·다크 모드 추가 검토
- 작성자 소개 문구 검토, 첫 실제 글 작성
- infra 접근 복구 후 manifests/Ingress/TLS와 릴리스 파이프라인 연결
- 운영 주소에서 실제 렌더링·댓글 확인

## 초기 검증

- `npm run build`: 타입 검사 오류·경고·힌트 0, 정적 빌드 성공
- 로컬 Chromium에서 1440/390/320px, 홈·글·소개 9개 조합 HTTP 200 및 가로 넘침 없음
- 데스크톱/모바일 홈 스크린샷 육안 확인
- 초안의 운영 HTML·RSS·사이트맵 제외 확인
- 로컬 Chromium에서 Giscus iframe의 댓글 0개·GitHub 로그인 UI 로드 및 페이지 오류 없음 확인 (댓글 게시하지 않음)
- Docker 실제 빌드·운영 배포·운영 댓글 작성은 미검증

## Actions 실행 정책

- main 푸시, main 대상 내부 PR, main 수동 실행에서 빌드를 검증한다.
- 내부 PR은 이 저장소 브랜치에서 열린 PR이다. 외부 포크 PR은 job 조건에서 제외해 러너·빌드 단계를 실행하지 않는다. GitHub에 skipped 워크플로 기록은 나타날 수 있다.
- 팀 구성원이라도 개인 포크에서 보낸 PR은 외부 포크로 취급한다.
- pull_request_target은 사용하지 않는다. 검증에 배포용 시크릿을 전달하지 않는다.
- GITHUB_TOKEN은 contents: read이며 checkout 인증 정보를 후속 명령에 남기지 않는다.
