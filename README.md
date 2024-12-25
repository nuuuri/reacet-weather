# 날씨 웹 페이지 with React

- 에코앤리치 프론트엔드 과제
- 작성자 : 박윤수 (sbfl125@gmail.com)
- 기한 : ~ 2024.12.26 (수) 오후 6시

## 0. 최종 구현 화면 미리보기

- 배포 : https://reacet-weather.vercel.app/

- 데스크탑 화면

  <img width="49%" src="https://github.com/user-attachments/assets/330a73dd-7421-4f19-8537-325cbc64594b"/>
  <img width="49%" src="https://github.com/user-attachments/assets/b3f20caf-ba41-4ec5-ba3b-ce83d9b18025"/>

  <img width="49%" src="https://github.com/user-attachments/assets/63fd522d-acff-4caf-9b41-713e39b0868d"/>
  <img width="49%" src="https://github.com/user-attachments/assets/3d02c376-ca58-4ffe-a55a-2b682662439e"/>

- 모바일 화면

  <img width="200px" height="420px" src="https://github.com/user-attachments/assets/f6c7186f-974f-450e-a1cf-015a020e0bc9"/>
  <img width="200px" height="420px" src="https://github.com/user-attachments/assets/8d12f388-339c-42c6-9a5e-98ba1605cba4"/>

## 1. 환경

- node : v20.16.0
- yarn : 4.5.3 (yarn berry)

### 1.1. 사용 기술

- 프로젝트 : React + Vite + SWC
- 언어 : TypeScript
- 상태관리 : Zustand
- 스타일 : Tailwind CSS

## 2. 시작하기

```bash
# 1. 의존성 패키지 일괄 설치
$ yarn install

# 2. vscode 설정
$ yarn dlx @yarnpkg/sdks vscode

# 3. 스크립트 실행
$ yarn dev
```

## 3. 폴더 구조

- 프로젝트에 따라 types 등의 폴더가 추가될 수 있음

```bash
  src
   ├── components   # 컴포넌트 관리
   ├── pages        # 페이지 관리
   ├── services     # API 관리
   ├── stores       # 전역 상태 관리
   ├── styles       # 전역 스타일 및 모듈화 스타일 파일 관리
   ├── types        # 전역 타입 관리
   └── utils        # 공통으로 사용되는 유틸리티 함수 관리
```

## 4. 구현 기능

### 4.0. 사용한 Open API

- 기상청 단기예보 Open API
  - 기상청 초단기예보조회 서비스
  - 기상청 단기예보조회 서비스
- Kakao Local API

### 4.1. 날씨 정보 가져오기

- [x] 유저의 현재 위치 감지
  - Geolocation API를 통한 사용자의 현재 위치 정보(경도, 위도) 가져오기
  - 경도, 위도 값을 기상청 Open API에 적용하기 위하여 x, y 값으로 변환
  - 경도, 위도 값과 Kakao Local API를 사용하여 현재 위치의 주소 불러오기
- [x] 현재 시간의 날씨 정보 불러오기
  - 변환한 x, y 값과 기상청 초단기예보조회 서비스를 사용하여 현재 위치의 현재 날씨 정보 불러오기
- [x] 오늘의 시간대 별 날씨 정보 불러오기
  - 변환한 x, y 값과 기상청 단기예보조회 서비스를 사용하여 현재 위치 기준 오늘의 시간대 별 날씨 정보 불러오기
  - [x] 1. 현재 시각 기준 + 24시간동안의 날씨 정보 불러오기 (ex. IOS 날씨 어플)
  - [x] 2. 1번으로 구현 완료하였으나, "오늘의 시간대"라는 조건에 따라 오늘 00:00 ~ 23:00 시의 날씨 불러오기로 변경

### 4.2. 장소 검색하기 & 즐겨찾기

- [x] 유저가 원하는 장소 검색 기능 (광역자체단체, 기초자치단체에 상관없이)
  - Kakao Local API를 사용해 검색어에 따른 자동 완성 기능 구현 (디바운스 적용)
  - 자동 완성 리스트를 클릭하면 해당 장소의 날씨 정보 불러오기
- [x] 검색한 장소를 즐겨찾기에 추가 & 삭제
  - 현재 위치는 항상 표출됨 (즐겨찾기 추가/삭제 불가)
  - 즐겨찾기에 저장한 장소는 LocalStorage에 경도, 위도 값을 저장

### 4.3. 기타 구현 내용

- [x] 반응형 적용
  - 모바일인 경우, LNB 바깥 영역을 터치하면 자동으로 닫히도록 구현
