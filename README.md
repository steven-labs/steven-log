# Steven Log

AI에 대한 생각과 소프트웨어 개발 기록을 위한 개인 블로그.

- 운영 예정 주소: https://steven-log.home201.com
- Astro + TypeScript + MDX, 정적 빌드
- 하늘색 포인트와 글 중심의 미니멀 UI
- 댓글: Giscus (연결 전)
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

공개 GitHub 저장소의 Discussions와 Giscus 앱 설치가 필요하다.
코드 저장소는 현재 비공개다. 댓글 전용 공개 저장소를 쓰거나 소스 공개 여부를 결정한 후 연결한다.
`.env.example`을 `.env`로 복사하고 giscus.app에서 얻은 공개 설정값을 입력한다.
설정 전에는 운영 페이지에 동작하지 않는 댓글 UI를 노출하지 않는다.
Docker 빌드에는 같은 이름의 `--build-arg`를 전달한다. 공개 설정값이며 인증 토큰을 넣지 않는다.

## 운영 배포 (아직 미연결)

`docker/Dockerfile`로 정적 사이트를 빌드하고 비루트 Nginx의 8080 포트에서 제공한다.
`/healthz`는 프로브용이다. release 태그 기반 Zot 푸시와 infra 갱신은 기존 home201 패턴을 따른다.
infra 접근이 없어 K8s manifest·Ingress·TLS·CI 자격증명은 아직 확인/적용하지 않았다.
현재 GitHub Actions는 빌드 검증만 수행하며 자동 운영 배포하지 않는다.

## 다음 작업

- UI 세부 조정 및 검색·다크 모드 추가 검토
- 작성자 소개 문구 검토, 첫 실제 글 작성
- Giscus 공개 Discussions 저장소·앱 설치·설정
- infra 접근 복구 후 manifests/Ingress/TLS와 릴리스 파이프라인 연결
- 운영 주소에서 실제 렌더링·댓글 확인

## 초기 검증

- `npm run build`: 타입 검사 오류·경고·힌트 0, 정적 빌드 성공
- 로컬 Chromium에서 1440/390/320px, 홈·글·소개 9개 조합 HTTP 200 및 가로 넘침 없음
- 데스크톱/모바일 홈 스크린샷 육안 확인
- 초안의 운영 HTML·RSS·사이트맵 제외 확인
- Docker 실제 빌드·운영 배포·Giscus 동작은 미검증
