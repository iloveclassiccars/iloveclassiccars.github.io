# 클래식카 부품 계산기

https://iloveclassiccars.github.io/ 에서 PC 화면, 휴대폰 화면, 영문판을 제공합니다.

## 파일

- `index.html` PC 화면, `m/index.html` 휴대폰 화면, `en/index.html` 영문판 (휴대폰 화면을 영어로 옮긴 것. 판 번호를 따로 적지 않고 `version.json`을 읽어 `data.js`를 불러옵니다)
- `data.js` 공통 부품 자료. 세 화면이 이 파일을 읽습니다. 부품을 고칠 때는 여기만 고칩니다.
- `version.json` 판 번호. 배포할 때 `index.html`과 `m/index.html`의 `BUILD`와 `data.js?v=` 숫자, 루트 `version.json`의 `build`를 같은 새 값으로 올립니다. `en/index.html`은 루트 `version.json`의 `build`를 읽어 `../data.js?v=`에 사용합니다.
