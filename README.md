# Steven Log

AI에 대한 생각과 소프트웨어 개발 기록을 위한 개인 블로그.

- 운영 주소: https://steven-log.home201.com
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

### 검색·공유 메타데이터

본문과 화면 제목은 유지하면서 `seoTitle`, `seoDescription`으로 검색용 정보를 별도 지정할 수 있다.
미지정 시 기존 `title`, `description`을 사용한다. 검색엔진이 실제 검색 결과의 제목·설명을 재작성할 수 있다.

```yaml
seoTitle: "글 제목 — 검색자가 알 수 있는 구체적 주제"
seoDescription: "실제 본문을 설명하는 간결한 요약"
socialImage: "../../assets/posts/example.png"
socialImageAlt: "이미지 내용 설명"
```

`socialImage`는 해당 글 기준 로컬 이미지 경로다. 공유용 JPEG를 폭 1200px로 생성하고 OG·Twitter 메타데이터와 BlogPosting JSON-LD에 사용한다.
글에는 작성자·발행일·언어·대표 URL을 자동 포함한다. 실질적으로 내용을 수정한 경우에만 선택 필드 `updated`를 명시한다(빌드 시각으로 날짜를 갱신하지 않는다).
초안·404에는 구조화 데이터를 출력하지 않는다. 공개 글만 운영 HTML·RSS·사이트맵에 포함된다.

Google Search Console은 Steven이 등록 완료했다고 확인했다(2026-11-11).
사이트맵 제출 여부와 URL 검사·색인 현황은 콘솔에서 확인해야 한다.
제출 주소: `https://steven-log.home201.com/sitemap-index.xml`.

텍스트 대안: `https://steven-log.home201.com/sitemap.txt`.
`src/pages/sitemap.txt.ts`에서 홈·소개·공개 글의 절대 URL을 한 줄씩 생성한다.
초안·미래 날짜 글은 개발 모드에서도 텍스트 사이트맵에서 제외한다.
`robots.txt`는 모든 크롤러에 공개 경로 접근을 허용하고 텍스트·XML 사이트맵을 함께 안내한다.
서치콘솔에는 `sitemap.txt`를 추가 제출해 실제 수집 결과를 확인한다.
파일의 HTTP 200 응답만으로 Google의 수집·색인 성공을 판단하지 않는다.

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

## 운영 배포

`release-X.Y.Z` 태그를 main에 포함된 커밋에 붙이면 GitHub Actions가 Docker 빌드를 검증하고
`registry.home201.com/steven-log:X.Y.Z` 이미지를 푸시한 뒤 `steven-labs/infra`의
`k8s/apps/home201/overlays/prod/kustomization.yaml`에서 steven-log 이미지 태그만 갱신한다.
ZOT_USER/ZOT_PASS/INFRA_DEPLOY_KEY는 조직 공통 Actions secrets를 사용한다.
태그 재사용 대신 새 버전을 발행한다. rollback은 해당 GitOps 이미지 태그를 이전 검증 버전으로 되돌린다.

ArgoCD home201 Application이 블로그의 별도 Deployment/Service/Ingress를 함께 관리한다.
네임스페이스 home201의 기존 regcred를 재사용하며 기존 홈페이지 리소스는 바꾸지 않는다.
별도 데이터 볼륨 없음. 비루트 Nginx 8080, /healthz probe, cert-manager/Traefik HTTPS 사용.
운영 배포 성공은 CI 완료만으로 판단하지 말고 실제 운영 주소에서 확인한다.

## 다음 작업

- UI 세부 조정 및 검색·다크 모드 추가 검토
- 작성자 소개 문구 검토, 첫 실제 글 작성
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

## 운영 확인 (2026-11-11)

release-0.1.0 운영 배포 완료. 유효한 Let's Encrypt HTTPS 인증서와 실제 PC·모바일 브라우저 응답을 확인했다.
홈·소개·RSS·사이트맵·health 정상, 초안·검증 페이지 404. 기존 home201.com 정상 유지.
실제 글은 아직 0건이며 운영 댓글 작성 검증은 첫 글 발행 후 진행한다.
검증 기록은 infra의 verification/steven-log-2026-11-11/에 있다.
