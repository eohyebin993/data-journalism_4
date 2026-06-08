/* index.js - 시각화 및 인터랙션 통합 (데이터 무결성 최적화 버전) */

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    initMap();
    initScrollReveal();
});

function initCharts() {
    // 1. Matrix Chart (Heatmap) - disaster_heatmap.html 로직 완벽 반영
    const matrixData = [{"x": "2026-05-26", "y": 0, "v": 0}, {"x": "2026-05-26", "y": 1, "v": 0}, {"x": "2026-05-26", "y": 2, "v": 0}, {"x": "2026-05-26", "y": 3, "v": 0}, {"x": "2026-05-26", "y": 4, "v": 0}, {"x": "2026-05-26", "y": 5, "v": 0}, {"x": "2026-05-26", "y": 6, "v": 0}, {"x": "2026-05-26", "y": 7, "v": 0}, {"x": "2026-05-26", "y": 8, "v": 0}, {"x": "2026-05-26", "y": 9, "v": 0}, {"x": "2026-05-26", "y": 10, "v": 0}, {"x": "2026-05-26", "y": 11, "v": 0}, {"x": "2026-05-26", "y": 12, "v": 0}, {"x": "2026-05-26", "y": 13, "v": 0}, {"x": "2026-05-26", "y": 14, "v": 0}, {"x": "2026-05-26", "y": 15, "v": 5}, {"x": "2026-05-26", "y": 16, "v": 2}, {"x": "2026-05-26", "y": 17, "v": 2}, {"x": "2026-05-26", "y": 18, "v": 1}, {"x": "2026-05-26", "y": 19, "v": 0}, {"x": "2026-05-26", "y": 20, "v": 0}, {"x": "2026-05-26", "y": 21, "v": 0}, {"x": "2026-05-26", "y": 22, "v": 1}, {"x": "2026-05-26", "y": 23, "v": 0}, {"x": "2026-05-27", "y": 0, "v": 0}, {"x": "2026-05-27", "y": 1, "v": 0}, {"x": "2026-05-27", "y": 2, "v": 0}, {"x": "2026-05-27", "y": 3, "v": 0}, {"x": "2026-05-27", "y": 4, "v": 0}, {"x": "2026-05-27", "y": 5, "v": 0}, {"x": "2026-05-27", "y": 6, "v": 1}, {"x": "2026-05-27", "y": 7, "v": 0}, {"x": "2026-05-27", "y": 8, "v": 0}, {"x": "2026-05-27", "y": 9, "v": 0}, {"x": "2026-05-27", "y": 10, "v": 0}, {"x": "2026-05-27", "y": 11, "v": 0}, {"x": "2026-05-27", "y": 12, "v": 0}, {"x": "2026-05-27", "y": 13, "v": 0}, {"x": "2026-05-27", "y": 14, "v": 0}, {"x": "2026-05-27", "y": 15, "v": 0}, {"x": "2026-05-27", "y": 16, "v": 0}, {"x": "2026-05-27", "y": 17, "v": 1}, {"x": "2026-05-27", "y": 18, "v": 0}, {"x": "2026-05-27", "y": 19, "v": 0}, {"x": "2026-05-27", "y": 20, "v": 0}, {"x": "2026-05-27", "y": 21, "v": 0}, {"x": "2026-05-27", "y": 22, "v": 1}, {"x": "2026-05-27", "y": 23, "v": 0}];
    const dateLabels = ["2026-05-26", "2026-05-27", "2026-05-28", "2026-05-29", "2026-05-30"];
    const hourLabels = Array.from({length: 24}, (_, i) => i);
    const maxV = 5;

    new Chart(document.getElementById('matrixChart'), {
        type: 'matrix',
        data: {
            datasets: [{
                label: '발송 건수',
                data: matrixData,
                backgroundColor(c) {
                    const v = c.raw ? c.raw.v : 0;
                    if (v === 0) return '#F9F9F9';
                    const alpha = 0.2 + (v / maxV) * 0.8;
                    return `rgba(34, 34, 34, ${alpha})`; // 무채색 톤 유지
                },
                borderColor: '#EEEEEE',
                borderWidth: 1,
                width: ({chart}) => (chart.chartArea?.width || 0) / dateLabels.length - 1,
                height: ({chart}) => (chart.chartArea?.height || 0) / 24 - 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => items[0].raw.x + ' ' + items[0].raw.y + '시',
                        label: (c) => `발송: ${c.raw.v}건`
                    }
                }
            },
            scales: {
                x: { type: 'category', labels: dateLabels, grid: { display: false } },
                y: { type: 'category', labels: hourLabels, reverse: true, grid: { display: false } }
            }
        }
    });

    // 2. Youtube & Trend Chart
    const pieData = [26, 18, 17, 4];
    const youtubeTotal = 65;

    new Chart(document.getElementById("youtubeChart"), {
        type: "pie",
        data: {
            labels: ["알림 소음/설정불편", "중립 및 기타의견", "과도한 발송/피로감", "수신 지연/뒷북 불만"],
            datasets: [{
                data: pieData,
                backgroundColor: ["#111111", "#444444", "#888888", "#CCCCCC"],
                borderColor: "#fff",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: {
                        label: (c) => `${c.label}: ${c.parsed}건 (${((c.parsed / youtubeTotal) * 100).toFixed(1)}%)`
                    }
                }
            }
        }
    });

    new Chart(document.getElementById("trendChart"), {
        type: "bar",
        data: {
            labels: ["재난문자 유형", "끄기 / 차단", "디바이스 / 설정", "커뮤니티 / 기타"],
            datasets: [{
                label: "비율 (%)",
                data: [34.1, 31.0, 30.2, 4.7],
                backgroundColor: "#222222"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    const select = document.getElementById("chartSelect");
    const youtubeWrap = document.getElementById("youtubeWrap");
    const trendWrap = document.getElementById("trendWrap");

    select.addEventListener("change", (e) => {
        if (e.target.value === "youtube") {
            youtubeWrap.style.display = "block";
            trendWrap.style.display = "none";
        } else {
            youtubeWrap.style.display = "none";
            trendWrap.style.display = "block";
        }
    });

    // 3. Doughnut Chart
    const surveyData = [18, 60, 11];
    const surveyTotal = 89;

    new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels: ['모두 읽는다', '첫 문장만 읽는다', '읽지 않는다'],
            datasets: [{
                data: surveyData,
                backgroundColor: ["#111111", "#666666", "#BBBBBB"],
                borderColor: 'white',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (c) => `${c.label}: ${c.raw}명 (${((c.raw / surveyTotal) * 100).toFixed(1)}%)`
                    }
                }
            }
        }
    });
}

function initMap() {
    // 1. 데이터 정의
    const regionData = {"파주시": 17, "평택시": 14, "고양시덕양구": 15, "성동구": 18, "송파구": 18, "고양시일산동구": 15, "종로구": 18, "이천시": 14, "시흥시": 14, "노원구": 18, "성남시분당구": 14, "양주시": 14, "안산시단원구": 14, "과천시": 14, "연천군": 14, "오산시": 14, "광명시": 14, "관악구": 18, "동두천시": 14, "안산시상록구": 14, "화성시": 14, "수원시권선구": 14, "의왕시": 14, "안양시만안구": 14, "양천구": 18, "용인시처인구": 14, "양평군": 14, "은평구": 19, "구로구": 18, "남양주시": 14, "광주시": 14, "강서구": 18, "금천구": 18, "서초구": 18, "김포시": 14, "중랑구": 18, "수원시팔달구": 14, "가평군": 14, "의정부시": 14, "수원시영통구": 14, "중구": 19, "광진구": 18, "성북구": 18, "도봉구": 18, "부천시": 14, "하남시": 14, "마포구": 18, "용인시기흥구": 14, "포천시": 14, "강동구": 18, "용인시수지구": 14, "동대문구": 18, "안성시": 14, "서대문구": 20, "동작구": 18, "성남시수정구": 14, "강북구": 18, "영등포구": 18, "용산구": 18, "군포시": 14, "고양시일산서구": 15, "성남시중원구": 14, "수원시장안구": 14, "구리시": 14, "여주시": 14, "강남구": 18, "안양시동안구": 14};

    // 2. 지도 초기화 (사고 지점 중심, 줌 레벨 조정)
    const map = L.map('map').setView([37.5642, 126.9673], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // 3. Pane 및 마커 추가 (seosomoon_sigungu_final.html 로직 반영)
    map.createPane('topPane');
    map.getPane('topPane').style.zIndex = 650;

    const incidentMarker = L.marker([37.5642, 126.9673], { pane: 'topPane' }).addTo(map);
    incidentMarker.bindPopup("<b>붕괴 사고 지점</b><br>서울특별시 서대문구 미근동").openPopup();

    // 4. 지하철 노선 (원본 데이터 기반)
    const subways = [
        { name: "1호선", color: "#A9C9FF", coords: [[37.5546, 126.9706], [37.5657, 126.9769], [37.5702, 126.9831], [37.5716, 126.9918]] },
        { name: "2호선", color: "#B2FFB2", coords: [[37.5574, 126.9561], [37.5599, 126.9636], [37.5651, 126.9772], [37.5660, 126.9826], [37.5663, 126.9910]] },
        { name: "5호선", color: "#D1B2FF", coords: [[37.5537, 126.9567], [37.5599, 126.9636], [37.5657, 126.9666], [37.5752, 126.9768], [37.5716, 126.9918]] },
        { name: "경의중앙선", color: "#B2FFFF", coords: [[37.5546, 126.9706], [37.5598, 126.9636], [37.5601, 126.9458]] }
    ];

    subways.forEach(line => {
        L.polyline(line.coords, { color: line.color, weight: 8, opacity: 0.8, pane: 'topPane' }).addTo(map);
    });

    // 5. 시군구 GeoJSON 및 스타일
    function getColor(d) {
        return d > 15 ? '#222222' :
               d > 10 ? '#555555' :
               d > 5  ? '#888888' :
               d > 0  ? '#BBBBBB' :
                        '#F5F5F5';
    }

    const GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/southkorea/southkorea-maps@master/kostat/2018/json/skorea-municipalities-2018-geo.json';
    
    fetch(GEOJSON_URL)
        .then(res => res.json())
        .then(data => {
            const geojson = L.geoJson(data, {
                style: (feature) => {
                    const val = regionData[feature.properties.name] || 0;
                    return { fillColor: getColor(val), weight: 0.5, opacity: 1, color: '#DDD', fillOpacity: 0.7 };
                },
                filter: (feature) => {
                    const code = String(feature.properties.code || "");
                    return code.startsWith("11") || code.startsWith("23") || code.startsWith("31");
                },
                onEachFeature: (feature, layer) => {
                    const val = regionData[feature.properties.name] || 0;
                    layer.bindPopup(`<b>${feature.properties.name}</b><br>재난문자 발송: ${val}건`);
                    if (val > 10) {
                        layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center', className: 'sigungu-label' });
                    }
                }
            }).addTo(map);
        });

    // 6. 정보창 및 범례 (원본 로직 반영)
    const info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    info.update = function (props) {
        this._div.innerHTML = '<h4>시군구별 발송 현황</h4>' + (props ? `<b>${props.name}</b><br>${regionData[props.name] || 0} 건` : '지역에 마우스를 올리세요');
    };
    info.addTo(map);

    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'legend'),
            grades = [0, 1, 5, 10, 15];
        div.innerHTML += '<b>발송 건수</b><br>';
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += `<i style="background:${getColor(grades[i] + 1)}"></i> ${grades[i]}${grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'}`;
        }
        return div;
    };
    legend.addTo(map);
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
