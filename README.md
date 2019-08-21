<p align="center">
  <img style="padding: 100px;" src="https://user-images.githubusercontent.com/31213226/63397983-1ead4d80-c407-11e9-98bd-906ca01db919.png">
</p>

# Common Bound

커먼바운드는 인공지능으로 기존의 문제를 새롭게 해결하고자 하는 개인이나 기업이 인공지능 학습에 필요한 데이터를 생산하는 작업을 크라우드소싱할 수 있도록 도와주는 플랫폼 입니다.
커먼바운드는 인공지능 학습 데이터를 생산하는데 필요한 온라인 작업 환경을 제공하고, 데이터를 생산하는데에 기여한 사람들이 그에 대한 정당한 보상을 지급받을 수 있도록 합니다.

![Version](https://img.shields.io/badge/version-1.0.0-red)
![Node Version](https://img.shields.io/node/v/@material-ui/core)
![NPM Version](https://img.shields.io/npm/v/pg)
![Commit Activity](https://img.shields.io/github/commit-activity/m/eunsukimme/Common-Bound)
![License](https://img.shields.io/github/license/eunsukimme/Common-Bound)
[![HitCount](http://hits.dwyl.io/eunsukimme/Common-Bound.svg)](http://hits.dwyl.io/eunsukimme/Common-Bound)

## Documentation

커먼바운드를 기획하게 된 모든 과정을 확인하시려면, [Documentation](https://git.swmgit.org/root/p1021_dal/wikis/idea/%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4)
페이지를 참고하세요.

## How To Install

자세한 설치 방법은 [How to Install](./How to Install.md)에서 확인하실 수 있습니다.

## Feature

- **이미지 크롭**

  - 이미지 업로드

    ​데이터 생산자가 참여한 프로젝트 주제에 알맞은 이미지를 업로드합니다. AI 어시스턴트가 활성화 된 상태라면, 이미지 속 ROI(텍스트 영역)을 감지하고 인식한 결과를 반환합니다. 여기서는 AI 어시스턴트를 비활성화 시킨 상태로 데이터 생산을 진행합니다.

    ![noname01](https://user-images.githubusercontent.com/39645522/63343174-4d381380-c388-11e9-8f66-2c9702b1af7e.jpg)

  - 이미지 크롭

    ​이미지가 정상적으로 업로드되면, **이미지 속 ROI**를 데이터 생산자가 직접 드래그 함으로써 찾아낼 수 있습니다. 마우스를 떼고 해당 영역을 클릭한 채로 움직이면 크롭된 영역을 움직일 수 있고, 모서리에 위치한 네모 박스를 조절하여 크기를 늘리고 줄일 수 있습니다.

    ![noname02](https://user-images.githubusercontent.com/39645522/63343173-4d381380-c388-11e9-9061-52263955b683.jpg)

  - 이미지 BOUND

    ​오른쪽 가이드라인 아래에 있는 **검은색 BOUND 버튼을 누르면 해당 ROI**를 크롭된 **ROI 리스트에 추가**합니다. 각 ROI 리스트는 고유한 텍스트 라벨 값을 저장하는 블루 박스를 포함합니다. **AI 가 활성화 된 상태라면 해당 블루박스에 인식된 텍스트 값이 자동으로 채워**집니다. 사용자는 해당 블루박스를 직접 입력하거나 AI가 인식한 값을 수정할 수 있습니다.

    ![noname03](https://user-images.githubusercontent.com/39645522/63343171-4d381380-c388-11e9-9246-6943454e1175.jpg)

  - 이미지 SHOW

    ​오른쪽 가이드라인 아래에 위치한 **하얀색 SHOW 버튼을 누르면 업로드한 이미지 위에 ROI 리스트에 저장된 내용을 노란색 네모 박스로 나타내줍니다**. 데이터 생산자는 자신이 크롭한 ROI 영역이 어디에 위치해 있는지 SHOW 버튼을 통해 쉽게 확인할 수 있습니다.

    ![noname04](https://user-images.githubusercontent.com/39645522/63343181-4e694080-c388-11e9-8d68-28ca7099ec5e.jpg)

- **AI 어시스턴트 기능**

  - 텍스트 감지(Text Detection)

    ​**AI 어시스턴트 버튼을 활성화 시키면 데이터 생산자가 업로드한 이미지를 AI 서버로 전송**합니다. AI 서버는 해당 이미지를 입력받아 Text Detection 모델의 인풋으로 넘겨주고, Text Detection 결과로 반환되는 이미지 속 ROI 의 좌표를 추출하여 JSON 형식으로 클라이언트에게 응답을 전달합니다.

    ![noname05](https://user-images.githubusercontent.com/39645522/63343180-4dd0aa00-c388-11e9-92ab-c2f4218a3ba2.jpg)

  - 텍스트 인식(Text Recognition)

    ​클라이언트에서 AI 어시스턴트가 감지한 ROI 영역을 전달받으면, 해당 영역을 크롭 ROI 리스트에 추가합니다. **각 ROI 영역은 다시 해당 영역의 텍스트 값이 무엇인지 인식하기 위해 AI 어시스턴트 서버로 전송**되고, AI 서버는 각 ROI 이미지를 입력받아 Text Recognition 모델의 인풋으로 넘겨줍니다. Text Recognition 결과로 반환되는 ROI의 라벨 값은 순차적으로 클라이언트에게 전달됩니다.

    ![noname06](https://user-images.githubusercontent.com/39645522/63343179-4dd0aa00-c388-11e9-80d9-9910cf2a1ce4.jpg)

  - 텍스트 감지 및 인식 결과

    ​클라이언트에서 Text Recognition 결과를 전달받으면 각 라벨 값은 ROI 리스트에 추가됩니다.

    ![noname07](https://user-images.githubusercontent.com/39645522/63343178-4dd0aa00-c388-11e9-9ec8-47f9d76d0c03.jpg)

  - AI 어시스턴트 협력 결과

    ![noname08](https://user-images.githubusercontent.com/39645522/63343176-4dd0aa00-c388-11e9-9069-6aad81b2e28b.jpg)

## Team

- **김은수**
  - **Github**: [eunsukimme](https://github.com/eunsukimme)
  - **Role**: _일정 및 이슈 관리, 문서 관리, Front end 및 Back end(Web, DB) 개발 총괄_
    - 프로젝트 및 멘토링 일정 관리
    - 프로젝트 개발 내용 문서화
    - 웹 서버 개발
    - 클라이언트 & 서버 연동
    - 데이터베이스 설계 및 관리

* **최현서**
  - **Github**: [HyunSeoChoi](https://github.com/HyunSeoChoi)
  - **Role**: _Front end 담당, 이미지 크롭 기능 개발_
    - 이미지 위의 ROI 영역을 크롭하는 BOUND 기능 개발
    - ROI 영역 수정, 삭제 인터페이스 개발
    - 이미지 업로드, 크롭 완료 등의 이벤트 발생 체크 & 서버로 데이터 전송 기능 개발
    - 캔버스 좌표계와 크롭 영역 좌표계 실제 비율로 동기화
    - 캔버스에 모든 크롭 영역을 그려주는 SHOW 기능 개발

- **김광호**
  - **Github**: [FKgk](https://github.com/FKgk)
  - **Role**: _Back end 담당, AI 어시스턴트 개발_
    - AI 어시스턴트 개발
    - AI 어시스턴트 서버 개발
    - Text Detection 논문 및 오픈소스 비교 분석
    - Text Recognition 논문 및 오픈소스 비교 분석
    - AWS DevOps 담당

## Code Convention

[Coding Style](./Coding Style.md)
