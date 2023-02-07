필요 소프트웨어
- git
- node.js
  - yarn
- firebase-tools

프로젝트 실행 방법

- git clone으로 소스 코드 로컬 환경에 checkout (git 필요)
  
  ``
  git clone https://github.com/ladley/edam
  ``
- 프로젝트 루트에서 yarn 실행하여 의존성 모듈 설치하기 (node, yarn 필요)

  ``
  yarn
  ``
- firebase login(firebase-tools 필요) 실행하여 파이어베이스 로그인

  ``
  firebase login
  ``
- Jira confluence의 .env 문서 참고하여 프로젝트 루트 폴더에 .env 파일 만들기
- firebas init 실행

  ``
  firebase init
  ``
  - Firestore, Hosting(configure) 선택
  - public 폴더는 build로 설정
- yarn start 하여 프로젝트 실행

  ``
  yarn start
  ``

작업 방법
- 지라에서 본인이 작업할 상태가 [해야 할 일]로 되어있는 Task유형의 이슈선정
  - 해당 이슈의 상태를 [진행중]으로 변경
  - 해당 이슈의 담당자를 본인으로 지정
  - 최초 추정치 작성(편하게 대충 얼마나 걸리겠다고 생각드는 만큼 적으면 됨. 보수에 영향 없음)
- 해당 이슈가 포함된 에픽의 이슈를 포함하여 로컬에서 브랜치 생성(에픽티켓넘버-에픽명/작업명)

  ``
  git branch AM-1-user-management/display-admin-info
  ``
- 해당 이슈로 전환한다

  ``
  git checkout AM-1-user-management/display-admin-info
  ``
- 소스코드 작업
- 커밋은 할당한 이슈 번호를 포함하여 커밋 메시지 작성(이슈티켓넘버 [add|mod|del]: 작업내용)
  
  ``
  git commit -m "AM-51 mod: display login user info"
  ``
  ``
  git commit -m "AM-51 mod: 로그인 사용자 정보 표시 작업"
  ``
- 원격 브랜치에 푸쉬(업스트림 설정되어있는경우 git push로 충분)
  
  ``
  git push --set-upstream origin/AM-1-user-management/display-admin-info
  ``
- 기능 단위로 작업이 완료 되면 깃헙의 풀 리퀘스트 생성
  - Reviewers에 Ladley 포함
  - Assignees에 본인 포함
  - 가능하면 Label 포함
  - 해당 기능이 포함된 Milestone 포함

- 지라에서 본인이 작업한 이슈 티켓의 상태를 [풀 리퀘스트]로 변경
- @Ladley가 확인하여 승인하면 병합되고, 입금 처리 
