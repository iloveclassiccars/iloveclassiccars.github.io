/* 클래식카 부품 계산기: 앱처럼 설치(홈 화면에 추가)할 수 있게 하는 최소 서비스 워커.
   저장(캐시)은 하지 않고 늘 최신 사이트를 그대로 불러옵니다. */
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request))});
