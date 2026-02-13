# WJwiki

![Project Cover Image](대표_이미지_경로_혹은_배포된_사이트_스크린샷.png)

> **"직접 기획하고 개발하여 운영 중인 개인 기술 블로그"**
>
> 기존 플랫폼의 제약에서 벗어나 원하는 기능을 자유롭게 구현하고 학습한 기술을 실제 서비스에 적용해 보기 위해 개발한 Next.js 기반 블로그 프로젝트입니다.
> 
> 블로그 포스팅 문서 모바일 환경 기준 퍼포먼스 90점 이상을 유지하며, 미드레인지 기기에서도 쾌적한 UX를 제공합니다.

<br/>

## 배포 링크

[WJwiki](https://wjwiki.vercel.app/)

<br/>

## 기술 스택

| Category           | Stacks                      | Reason for Selection                        |
| :----------------- | :-------------------------- | :------------------------------------------ |
| **Framework**      | **Next.js 14**              | SSR을 통한 SEO 최적화 및 최신 리액트 아키텍처 학습            |
| **Language**       | **TypeScript**              | 정적 타입 시스템을 통한 런타임 에러 방지 및 유지보수성 향상          |
| **Styling**        | **Tailwind CSS, Shadcn UI** | 일관된 디자인 시스템 구축 및 개발 생산성 확보                  |
| **Database**       | **Neon DB**                 | Serverless 환경에 최적화된 DB 연결 및 확장성 고려          |
| **Infrastructure** | **Vercel**                  | 프론트엔드 배포 및 Serverless Functions, 스토리지 통합 관리 |
| **Auth**           | **NextAuth.js (v5)**        | 보안성 높은 인증 시스템 구축 (JWT Strategy)             |
| **Validation**     | **Zod**                     | 런타임 데이터 검증 및 타입 안전성 확보                      |


<br/>

## 주요 기능

방문자분들은 비회원 상태의 기능만 사용하실 수 있으므로, 관리자 로그인 상태는 아래의 시연 자료와 코드를 통해 확인하실 수 있습니다.


### 1. 주요 UX
누구나 접근하여 체험할 수 있는 기능입니다.

* **공개된 게시글 조회**
* **게시글 검색**
* **PC, 태블릿, 모바일 별 반응형 UI**
* **다크 모드**


### 2. 관리자 UI

**[Feature A] 권한 기반의 동적 UI 렌더링**
> 로그인 상태를 감지하여 일반 사용자에게는 공개된 게시글과 로그인 페이지 이동 아이콘을, 관리자에게는 모든 게시글과 퀵메뉴를 노출하는 UI를 렌더링합니다.

![Quick Menu Comparison](여기에_일반인일때_관리자일때_메뉴가_다른_비교샷.png)
* **관련 코드:** `src/components/post/PostActionButtons.tsx` (관련 컴포넌트 링크)

**[Feature B] On-Page Management (직관적인 수정/삭제)**
>  로그인 상태를 감지하여 일반 사용자에게는 '최상단·최하단 이동, URL 복사' 버튼만, 관리자에게는 '수정, 삭제' 옵션이 추가로 포함된 사이드바를 렌더링합니다. 별도의 대시보드 진입 없이 콘텐츠 관리가 가능합니다.

![Direct Edit Demo GIF](글_상세페이지에서_수정버튼_눌러서_에디터로_가는_움짤.gif)
* **관련 코드:** `src/components/post/PostActionButtons.tsx` (관련 컴포넌트 링크)


### 3. 시스템 아키텍처
안정적인 서비스 운영을 위해 보이지 않는 백엔드 로직과 보안 프로세스를 구축했습니다.

**Enterprise-Level Security (보안)**
* **2FA:** ID/PW 외에 **TOTP(Google Authenticator)** 인증을 추가하여 관리자 계정 보안 강화
* **Email Alert**: nodemailer를 활용해 로그인 시 알림 이메일 발송 
* **Secure Asset Proxy:** 비공개 이미지 접근 시 서버 측 프록시를 통해 권한을 검증하고, 익명 사용자의 원본 URL 접근 차단
* **XSS Protection:** `rehype-sanitize`를 적용하여 마크다운 렌더링 시 악성 스크립트 주입 방지
* **RBAC Middleware:** Next.js Middleware를 활용해 경로별 접근 권한 제어

**Smart Media Pipeline (최적화 및 운영)**
* **Orphaned Media GC (가비지 컬렉션):** 게시글 작성 중 업로드되었으나 최종적으로 사용되지 않은 '고아 파일'을 Cron Job으로 자동 감지 및 삭제하여 스토리지 비용 절감
* **Adaptive Image Serving:** 업로드된 이미지를 WebP 포맷 및 다양한 해상도로 자동 변환/압축하여 LCP 성능 최적화
* **Metadata Separation:** 파일 바이너리는 Blob Storage에, 메타데이터는 DB(Media Table)로 분리 설계하여 데이터 무결성 확보

<br/>

## 핵심 기술적 의사결정 및 트러블슈팅

### 1. 보안과 UX의 딜레마: Vercel Blob 비공개 처리 전략
**[문제 상황]**
게시글을 '비공개'로 전환하더라도, 본문에 삽입된 이미지의 CDN URL(Vercel Blob)은 여전히 Public 상태로 남아있어 URL을 아는 외부인이 접근 가능한 보안 취약점을 발견했습니다.

**[해결 과정]**
* **시도 (Proxy):** 이미지 요청을 미들웨어로 검증하려 했으나, CDN 캐싱 이점을 잃어 로딩 속도가 저하됨을 확인했습니다.
* **해결 (Asset Rotation):** 게시글 비공개 전환 시, 기존 이미지를 **폐기(Delete)**하고 새로운 난수 경로로 **복제(Copy)**하여 링크를 물리적으로 교체하는 로직을 구현했습니다.

**[성과]**
관리자의 게시글 비공개 시의 작업 처리 시간이 소폭 증가했으나, 일반 사용자에게는 **네이티브 CDN 속도**를 제공하면서도 **데이터 격리**를 달성하는 최적의 트레이드오프를 찾아냈습니다.

### 2. Defense in Depth: Server Action 보안 강화
**[문제 상황]**
Next.js의 Server Action은 클라이언트에서 직접 호출 가능한 공개 API 엔드포인트와 같습니다. 초기에는 미들웨어로 페이지 접근만 제어했으나, `cURL` 등을 통한 직접적인 데이터 변조 요청(CUD)에는 취약하다는 점을 인지했습니다.

**[해결 과정]**
**심층 방어** 원칙을 적용하여 보안 계층을 강화했습니다.
* **Authentication:** 모든 CUD 및 비공개 데이터 조회 Action 함수 최상단에 세션 검증 로직(`auth 확인 절차`) 을 강제했습니다.
* **Validation:** **Zod**를 도입하여 클라이언트로부터 넘어오는 모든 입력값의 타입과 형식을 서버 사이드에서 이중으로 검증하여 무결성이 깨진 데이터의 DB 유입을 원천 차단했습니다.

<br/>

## 디렉토리 구조
```bash
 ┣ 📂prisma  
 ┃ ┣ 📂migrations  
 ┃ ┗ 📜schema.prisma        # Neon DB 구조
 ┣ 📂public  
 ┣ 📂src  
 ┃ ┣ 📂app  
 ┃ ┃ ┣ 📂2fa-verify         # 2차 인증(OTP) 페이지
 ┃ ┃ ┣ 📂api                # 라우트 핸들러
 ┃ ┃ ┣ 📂images             # 내부 이미지 에셋
 ┃ ┃ ┣ 📂login              # 로그인 페이지
 ┃ ┃ ┣ 📂posts              # 게시글 페이지
 ┃ ┃ ┣ 📂terms              # 약관 및 개인정보처리방침
 ┃ ┣ 📂components           # UI 컴포넌트
 ┃ ┃ ┣ 📂mainPage           # 메인 화면 UI
 ┃ ┃ ┣ 📂providers          # 전역 UI 관련
 ┃ ┃ ┗ 📂ui                 # shadcn UI 집합
 ┃ ┣ 📂constants            # 상수 집합
 ┃ ┣ 📂hooks                # 모바일 환경 감지
 ┃ ┣ 📂lib                  # 로그인 액션, CRUD 등 백엔드 로직
 ┃ ┣ 📜auth.config.ts       # 로그인 처리 및 인증 설정
 ┃ ┣ 📜auth.middleware.config.ts  
 ┃ ┣ 📜auth.ts  
 ┃ ┗ 📜middleware.ts        # 라우트 보호 미들웨어
