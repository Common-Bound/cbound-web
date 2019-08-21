# 커먼바운드

![Version](https://img.shields.io/badge/version-1.0.0-red)
![Node Version](https://img.shields.io/node/v/@material-ui/core)
![NPM Version](https://img.shields.io/npm/v/pg)
![Commit Activity](https://img.shields.io/github/commit-activity/m/eunsukimme/Common-Bound)
[![HitCount](http://hits.dwyl.io/eunsukimme/Common-Bound.svg)](http://hits.dwyl.io/eunsukimme/Common-Bound)
![License](https://img.shields.io/github/license/eunsukimme/Common-Bound)

### 멤버

- **김은수** - _일정 및 이슈 관리, 문서 관리, Back end(Web, DB) 및 Front end 개발 총괄_ - [eunsukimme](https://github.com/eunsukimme)

- 데이터 생산자가 생산한 데이터를 검수하는 과정에서 검수자가 검수 페이지에 접속하면 DB에서 검수할 데이터를 가져온다. 검수자는 가져온 데이터의 적합/부적합 여부를 판단한 뒤에 이를 다시 DB로 전송하고, DB에 저장된 해당 데이터의 검수 현황 필드를 갱신시킨다. 이때, **여러 검수자가 동시에 접속하여 동일한 데이터에 대해서 검수를 진행하면**, **먼저 검수를 진행한 3**명의 검수 결과만**DB**에 반영되고 다른 검수자들의 작업은 반영되지 못하게 된다. 즉, 검수자가 작업을 진행했음에도 불구하고 기여를 인정받지 못하게 되는 것이다. 또한 여러 검수자가 동시에 접속하면, 이전 검수자의 히스토리도 확인할 수 없게 된다. **이러한 문제를 해결하기 위해서 작업 큐**(Job Queue)**를 만들고 검수할 데이터를 큐에 저장**하여 먼저 검수 페이지에 접속한 검수자가 특정 데이터를 불러오면, 해당 작업을 큐에서 불러와 스케줄링 상태를 'queued' 에서 'reserved'로 변경하도록 하였다. 그리하여 **먼저 접속한 검수자가 검수를 진행하는 동안 다른 검수자는 해당 데이터에 접근하지 못하도록 하고,** 검수 작업이 끝나면 해당 데이터의 검수 현황을 갱신한 후 다시 큐에 넣어 스케줄링 상태를 'reserved'에서 'queued'로 변경시킨다. 그런 뒤 다른 검수자가 검수 페이지에 접속했을 때, 해당 데이터를 불러올 수 있고 이전 검수자의 검수 히스토리를 확인할 수 있게 된다.

  또한 **검수 작업을 트랜잭션으로 만들어서, 검수 프로세스가 온전히 완료되어야만 commit 하여 데이터의 검수 현황을 갱신**시킬 수 있도록 하였다. 그리하여 만약 검수자가 검수 도중 이탈하게 된다면 rollback 하여 해당 검수 작업은 반영되지 않도록 하였다.

- **최현서** - _Client - Front end 개발, 이미지 크롭 기능 개발_ - [HyunSeoChoi](https://github.com/HyunSeoChoi)

  - 연속적으로 크롭된 영역이 바뀌는 우리 프로젝트에서는 **캔버스에 그려줄 때 Render**에서 실행하게 되면 비동기로 실행되지 않아 한 박자 늦게 캔버스에 크롭 영역을 그려주는 문제가 발생했다. 그래서 **React 공식 Docs**와 **스택 오버플로**에서 비슷한 문제들을 검색해보니 리액트에서 이런 이슈를 해결하고자 5월에 새로운 리액트 라이프사이클이 생겼다는 것을 알게 되어 성공적으로 프로젝트에 적용했다. 또한 **라이프사이클 내에서 state**를 수정하게 되면 무한루프가 도는 것을 따로 **Flag**변수를 두어 해결했다.

    **크롭한 영역을 전체적으로 그리는 부분에서 가끔 잘못되거나 다른 영역이 검출되었다**. 이런 현상이 왜 일어나는지 확인하기 위해 drawImage를 활용한 다른 소스를 보고 비교해봤다. 그 결과 **크롭 영역 좌표계와 canvas**의 좌표계가 서로 다르고 **CSS 스타일 강제조정에 의해 캔버스에 스케일링이 발생한다는 것을 확인**했다. 캔버스는 max-width를 720px 로 조정하는데 720px을 넘어갈 경우 스케일링을 해주기 위해 CSS 인터넷 강의 canvas 부분을 참고하여 **naturalWidth**와 **width 비율로 나눠주니 스케일링에 대해서도 정확한 좌표가 계산**되고 확대를 해도 수식에 의해 스케일링을 고려하므로 마찬가지로 정확하게 계산되었다. 하지만 이후에 글자가 지속적으로 가려져 디스코드 커뮤니티에 글을 올려보니 외곽선은 캔버스가 차지하는 영역에 포함된 데 비해 그리기 영역이 외곽선 안쪽이기 때문에 발생하는 것을 알아냈다. 따라서 **외곽선 두께도 좌표 계산에 포함시켜 외곽선 영역을 제외시켰다**.

- **김광호** - _AI 어시스턴트 개발, Back end(AI server) 개발_ - [FKgk](https://github.com/FKgk)

- 사용자가 한 이미지를 올릴 때 처음엔 Detection 요청을, 그런 다음 검출된 텍스트 영역 개수만큼 Recognition 요청을 보낸다. 이러다 보니 **서버는 동시에 다수의 요청에 대해 각각 병렬적으로 수행할 수 있도록 설계되어야 했다**. 이를 위해 **Nginx**를 통한 로드밸런싱으로 다수의 요청에 대응할 수 있게 하였다.

  Detection와 Recognition를 한 서버에 두니, **많은 GPU Memory 사용량에 의해 Out of Memory 에러가 발생했다**. GPU 사용량을 자세히 보니 Detection을 수행할 때는 많은 메모리를 요구하지만, Recognition의 경우 Detection에 비해 적은 메모리만으로도 충분했다. 그래서 **Detection**와 **Recognition**의 서버를 분리시켜**Detection**은 높은 메모리를 갖는**EC2, Recognition**은 빠른 연산을 갖는**EC2**에서 동작하도록 했다.

### 기능

- 기능 설명

  - 이미지 크롭

    - 이미지 업로드

      ​ 데이터 생산자가 참여한 프로젝트 주제에 알맞은 이미지를 업로드한다. AI 어시스턴트가 활성화 된 상태라면, 이미지 속 ROI(텍스트 영역)을 감지하고 인식한 결과를 반환한다. 여기서는 AI 어시스턴트를 비활성화 시킨 상태로 데이터 생산을 진행한다.

    - 이미지 크롭

      ​ 이미지가 정상적으로 업로드되면, **이미지 속 ROI**를 데이터 생산자가 직접 드래그 함으로써 찾아낼 수 있다. 마우스를 떼고 해당 영역을 클릭한 채로 움직이면 크롭된 영역을 움직일 수 있고, 모서리에 위치한 네모 박스를 조절하여 크기를 늘리고 줄일 수 있다.

    - 이미지 BOUND

      ​ 오른쪽 가이드라인 아래에 있는 **검은색 BOUND 버튼을 누르면 해당 ROI**를 크롭된 **ROI 리스트에 추가**한다. 각 ROI 리스트는 고유한 텍스트 라벨 값을 저장하는 블루 박스를 포함한다. **AI 가 활성화 된 상태라면 해당 블루박스에 인식된 텍스트 값이 자동으로 채워**진다. 사용자는 해당 블루박스를 직접 입력하거나 AI가 인식한 값을 수정할 수 있다.

    - 이미지 SHOW

      ​ 오른쪽 가이드라인 아래에 위치한 **하얀색 SHOW 버튼을 누르면 업로드한 이미지 위에 ROI 리스트에 저장된 내용을 노란색 네모 박스로 나타내준다**. 데이터 생산자는 자신이 크롭한 ROI 영역이 어디에 위치해 있는지 SHOW 버튼을 통해 쉽게 확인할 수 있다.

  - AI 어시스턴트 기능

    - 텍스트 감지(Text Detection)

      ​ **AI 어시스턴트 버튼을 활성화 시키면 데이터 생산자가 업로드한 이미지를 AI 서버로 전송**한다. AI 서버는 해당 이미지를 입력받아 Text Detection 모델의 인풋으로 넘겨주고, Text Detection 결과로 반환되는 이미지 속 ROI 의 좌표를 추출하여 JSON 형식으로 클라이언트에게 응답을 전달한다.

    - 텍스트 인식(Text Recognition)

      ​ 클라이언트에서 AI 어시스턴트가 감지한 ROI 영역을 전달받으면, 해당 영역을 크롭 ROI 리스트에 추가한다. **각 ROI 영역은 다시 해당 영역의 텍스트 값이 무엇인지 인식하기 위해 AI 어시스턴트 서버로 전송**되고, AI 서버는 각 ROI 이미지를 입력받아 Text Recognition 모델의 인풋으로 넘겨준다. Text Recognition 결과로 반환되는 ROI의 라벨 값은 순차적으로 클라이언트에게 전달된다.

    - 텍스트 감지 및 인식 결과

      ​ 클라이언트에서 Text Recognition 결과를 전달받으면 각 라벨 값은 ROI 리스트에 추가된다.

- 주요 코드 정보 설명 및 기능구현 화면 캡처

  - 이미지 업로드

  ![noname01](https://user-images.githubusercontent.com/39645522/63343174-4d381380-c388-11e9-8f66-2c9702b1af7e.jpg)

  - 이미지 크롭

  ![noname02](https://user-images.githubusercontent.com/39645522/63343173-4d381380-c388-11e9-9061-52263955b683.jpg)

  - 이미지 BOUND

  ![noname03](https://user-images.githubusercontent.com/39645522/63343171-4d381380-c388-11e9-9246-6943454e1175.jpg)

  - 이미지 SHOW

  ![noname04](https://user-images.githubusercontent.com/39645522/63343181-4e694080-c388-11e9-8d68-28ca7099ec5e.jpg)

  - 텍스트 감지

  ![noname05](https://user-images.githubusercontent.com/39645522/63343180-4dd0aa00-c388-11e9-92ab-c2f4218a3ba2.jpg)

  - 텍스트 인식

  ![noname06](https://user-images.githubusercontent.com/39645522/63343179-4dd0aa00-c388-11e9-80d9-9910cf2a1ce4.jpg)

  - 텍스트 인식 결과

  ![noname07](https://user-images.githubusercontent.com/39645522/63343178-4dd0aa00-c388-11e9-9ec8-47f9d76d0c03.jpg)

  - AI 어시스턴트 협력 결과

  ![noname08](https://user-images.githubusercontent.com/39645522/63343176-4dd0aa00-c388-11e9-9069-6aad81b2e28b.jpg)

[contributors](https://github.com/eunsukimme/Common-Bound/contributors) 를 참고해주세요

## 코딩 스타일

[Coding Style](./Coding Style.md)

## 설치 방법

[How to Install](./How to Install.md)
