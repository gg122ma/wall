/**
 * Echo Wall-owned read-only building snapshot derived from the auxiliary KMK Digital Twin data.
 * It is intentionally lightweight and does not create a runtime dependency on the Digital Twin project.
 */
window.CAMPUS_ZONES = {
  "learning": {
    "en": "Learning & Teaching",
    "ms": "Pembelajaran & Pengajaran",
    "zh": "学习与教学区"
  },
  "student-life": {
    "en": "Student Life",
    "ms": "Kehidupan Pelajar",
    "zh": "学生生活区"
  },
  "residence": {
    "en": "Residence & Dining",
    "ms": "Kediaman & Makan",
    "zh": "宿舍与餐饮区"
  },
  "sports": {
    "en": "Sports & Activity",
    "ms": "Sukan & Aktiviti",
    "zh": "体育与活动区"
  },
  "services": {
    "en": "Administration & Staff",
    "ms": "Pentadbiran & Staf",
    "zh": "行政与教职员区"
  },
  "mobility": {
    "en": "Access & Security",
    "ms": "Akses & Keselamatan",
    "zh": "出入口与保安区"
  }
};
window.CAMPUS_BUILDINGS = [
  {
    "id": "B_MASJID",
    "name": "Masjid Khulafa Ar Rasyidin",
    "category": "masjid",
    "zoneId": "student-life",
    "emoji": "🕌",
    "description": {
      "zh": "Masjid Khulafa Ar Rasyidin——KMK 校园地标，有醒目的绿色圆顶与宣礼塔，宽敞的祈祷空间服务全体师生。",
      "ms": "Masjid Khulafa Ar Rasyidin — mercu tanda kampus KMK dengan kubah hijau besar dan menara (minaret). Ruang solat luas untuk seluruh warga kolej.",
      "en": "Masjid Khulafa Ar Rasyidin — KMK's landmark mosque, with a striking green dome and minaret. A spacious prayer hall serves the whole college community."
    },
    "tags": {
      "zh": [
        "清真寺",
        "礼拜",
        "宗教",
        "圆顶",
        "宣礼塔",
        "主麻日",
        "哈里发",
        "Ar Rasyidin"
      ],
      "ms": [
        "masjid",
        "solat",
        "agama",
        "kubah",
        "minaret",
        "jumaat",
        "khulafa",
        "ar rasyidin"
      ],
      "en": [
        "mosque",
        "prayer",
        "religion",
        "dome",
        "minaret",
        "Friday prayer",
        "Khulafa",
        "Ar Rasyidin"
      ]
    },
    "floors": 2,
    "hours": "24 jam · Solat Jumaat 12:45",
    "center": [
      -72.73,
      -27.189999999999998
    ],
    "overviewPolygon": [
      [
        24.11,
        92.0
      ],
      [
        19.98,
        79.88
      ],
      [
        18.13,
        80.73
      ],
      [
        9.88,
        56.51
      ],
      [
        11.94,
        55.55
      ],
      [
        8.0,
        43.97
      ],
      [
        28.7,
        34.48
      ],
      [
        36.29,
        30.99
      ],
      [
        34.82,
        26.66
      ],
      [
        45.99,
        21.54
      ],
      [
        47.12,
        24.87
      ],
      [
        59.9,
        19.01
      ],
      [
        60.84,
        18.58
      ],
      [
        59.6,
        14.93
      ],
      [
        74.72,
        8.0
      ],
      [
        79.19,
        21.18
      ],
      [
        64.35,
        27.98
      ],
      [
        63.13,
        24.37
      ],
      [
        58.37,
        26.56
      ],
      [
        71.65,
        65.69
      ],
      [
        77.64,
        62.94
      ],
      [
        76.2,
        58.72
      ],
      [
        87.81,
        53.4
      ],
      [
        92.0,
        65.72
      ],
      [
        78.48,
        71.91
      ],
      [
        77.2,
        68.16
      ],
      [
        63.85,
        74.29
      ],
      [
        65.75,
        79.85
      ],
      [
        55.06,
        84.74
      ],
      [
        53.01,
        78.74
      ],
      [
        46.79,
        81.59
      ]
    ],
    "wallKey": "building:B_MASJID"
  },
  {
    "id": "B_DEWAN_MAHAWANGSA",
    "name": "Dewan Mahawangsa",
    "category": "dewan",
    "zoneId": "learning",
    "emoji": "🎓",
    "description": {
      "zh": "KMK 最大的主礼堂，屋顶高挑、中间无柱。用于毕业典礼、大型集会、讲座和官方仪式。",
      "ms": "Dewan utama dan terbesar di KMK. Bumbung tinggi tanpa tiang tengah. Digunakan untuk konvokesyen, perhimpunan besar, ceramah dan majlis rasmi.",
      "en": "KMK's largest and main hall, with a tall column-free roof spanning the whole space. Used for convocations, large assemblies, talks and official ceremonies."
    },
    "tags": {
      "zh": [
        "礼堂",
        "仪式",
        "毕业典礼",
        "集会"
      ],
      "ms": [
        "dewan",
        "majlis",
        "konvokesyen",
        "perhimpunan"
      ],
      "en": [
        "hall",
        "ceremony",
        "convocation",
        "assembly"
      ]
    },
    "floors": 2,
    "hours": "Mengikut acara · 08:00–22:00",
    "center": [
      -124.63499999999999,
      -157.73
    ],
    "overviewPolygon": [
      [
        22.01,
        78.79
      ],
      [
        21.99,
        63.52
      ],
      [
        13.53,
        63.54
      ],
      [
        8.0,
        63.55
      ],
      [
        8.0,
        36.46
      ],
      [
        13.3,
        36.45
      ],
      [
        21.61,
        36.43
      ],
      [
        21.58,
        21.18
      ],
      [
        40.73,
        21.11
      ],
      [
        40.71,
        8.07
      ],
      [
        46.61,
        8.07
      ],
      [
        50.66,
        8.03
      ],
      [
        54.59,
        8.02
      ],
      [
        59.41,
        8.0
      ],
      [
        59.43,
        10.3
      ],
      [
        59.44,
        20.93
      ],
      [
        91.9,
        20.85
      ],
      [
        91.97,
        68.53
      ],
      [
        92.0,
        80.34
      ],
      [
        60.64,
        80.44
      ],
      [
        60.67,
        91.93
      ],
      [
        40.7,
        92.0
      ],
      [
        40.69,
        78.76
      ]
    ],
    "wallKey": "building:B_DEWAN_MAHAWANGSA"
  },
  {
    "id": "B_DEWAN_KULIAH",
    "name": "Kompleks Dewan Kuliah",
    "category": "academic",
    "zoneId": "learning",
    "emoji": "📐",
    "description": {
      "zh": "主教学楼群——多间大型讲堂与导修室环绕着中央庭院。",
      "ms": "Kompleks dewan kuliah utama — beberapa dewan kuliah besar dan bilik tutorial mengelilingi laman dalaman.",
      "en": "The main lecture-hall complex — several large lecture halls and tutorial rooms arranged around a central courtyard."
    },
    "tags": {
      "zh": [
        "讲堂",
        "授课",
        "讲座"
      ],
      "ms": [
        "dewan kuliah",
        "kuliah",
        "lecture"
      ],
      "en": [
        "lecture hall",
        "lectures",
        "lecture"
      ]
    },
    "floors": 3,
    "hours": "Isnin–Sabtu 07:30–18:00",
    "center": [
      -249.005,
      -36.3
    ],
    "overviewPolygon": [
      [
        8.79,
        80.98
      ],
      [
        8.38,
        48.62
      ],
      [
        8.0,
        17.05
      ],
      [
        35.23,
        16.82
      ],
      [
        35.13,
        9.47
      ],
      [
        45.71,
        9.4
      ],
      [
        45.78,
        13.22
      ],
      [
        69.01,
        13.01
      ],
      [
        68.96,
        8.07
      ],
      [
        78.08,
        8.0
      ],
      [
        78.17,
        14.61
      ],
      [
        84.51,
        14.55
      ],
      [
        91.18,
        14.5
      ],
      [
        91.58,
        48.74
      ],
      [
        92.0,
        84.92
      ],
      [
        80.49,
        85.0
      ],
      [
        80.58,
        91.9
      ],
      [
        68.24,
        92.0
      ],
      [
        68.16,
        84.8
      ],
      [
        56.05,
        84.89
      ],
      [
        46.39,
        84.98
      ],
      [
        46.45,
        88.9
      ],
      [
        34.39,
        88.99
      ],
      [
        34.31,
        80.74
      ]
    ],
    "wallKey": "building:B_DEWAN_KULIAH"
  },
  {
    "id": "B_PUSTAKA",
    "name": "Pustaka (Perpustakaan)",
    "category": "library",
    "zoneId": "learning",
    "emoji": "📚",
    "description": {
      "zh": "KMK 主图书馆，设有学术藏书、小组学习区、静音自习区与阅读空间。",
      "ms": "Perpustakaan utama KMK. Koleksi buku akademik, zon belajar berkumpulan, zon senyap dan ruang baca.",
      "en": "KMK's main library. Academic book collections, group study zones, a silent study zone and reading spaces."
    },
    "tags": {
      "zh": [
        "图书馆",
        "藏书",
        "书籍",
        "学习",
        "wifi"
      ],
      "ms": [
        "perpustakaan",
        "pustaka",
        "buku",
        "belajar",
        "wifi"
      ],
      "en": [
        "library",
        "books",
        "books",
        "study",
        "wifi"
      ]
    },
    "floors": 3,
    "hours": "Isnin–Khamis 08:30–21:30 · Sabtu 08:30–17:00",
    "center": [
      -261.96000000000004,
      45.415
    ],
    "overviewPolygon": [
      [
        8.78,
        68.14
      ],
      [
        8.4,
        51.26
      ],
      [
        8.36,
        49.41
      ],
      [
        8.31,
        47.28
      ],
      [
        8.0,
        33.48
      ],
      [
        32.51,
        33.06
      ],
      [
        32.27,
        22.02
      ],
      [
        31.97,
        9.03
      ],
      [
        73.93,
        8.3
      ],
      [
        91.37,
        8.0
      ],
      [
        91.94,
        33.58
      ],
      [
        87.81,
        33.66
      ],
      [
        87.95,
        39.84
      ],
      [
        84.5,
        39.9
      ],
      [
        84.73,
        49.97
      ],
      [
        84.97,
        60.89
      ],
      [
        87.6,
        60.84
      ],
      [
        87.73,
        66.19
      ],
      [
        91.46,
        66.13
      ],
      [
        92.0,
        91.0
      ],
      [
        87.55,
        91.08
      ],
      [
        33.75,
        92.0
      ],
      [
        33.2,
        67.72
      ],
      [
        10.64,
        68.1
      ]
    ],
    "wallKey": "building:B_PUSTAKA"
  },
  {
    "id": "B_LANGKASUKA",
    "name": "Bangunan Langkasuka",
    "category": "academic",
    "zoneId": "learning",
    "emoji": "🏫",
    "description": {
      "zh": "Langkasuka 楼——附加讲堂、实验室、系办公室与讲师办公室。",
      "ms": "Bangunan Langkasuka — bilik kuliah tambahan, makmal, pejabat jabatan dan pejabat pensyarah.",
      "en": "Bangunan Langkasuka — additional lecture rooms, laboratories, department offices and lecturer offices."
    },
    "tags": {
      "zh": [
        "授课",
        "讲师",
        "系",
        "Langkasuka"
      ],
      "ms": [
        "kuliah",
        "pensyarah",
        "jabatan",
        "langkasuka"
      ],
      "en": [
        "lectures",
        "lecturer",
        "department",
        "Langkasuka"
      ]
    },
    "floors": 3,
    "hours": "Isnin–Sabtu 07:30–18:00",
    "center": [
      -251.785,
      119.97
    ],
    "overviewPolygon": [
      [
        15.6,
        82.39
      ],
      [
        8.19,
        82.43
      ],
      [
        8.15,
        75.8
      ],
      [
        8.0,
        16.14
      ],
      [
        13.94,
        16.1
      ],
      [
        13.92,
        8.1
      ],
      [
        28.53,
        8.0
      ],
      [
        28.55,
        16.72
      ],
      [
        33.68,
        16.69
      ],
      [
        91.8,
        16.24
      ],
      [
        91.96,
        74.98
      ],
      [
        92.0,
        83.31
      ],
      [
        62.43,
        83.55
      ],
      [
        28.41,
        83.8
      ],
      [
        28.44,
        91.88
      ],
      [
        15.63,
        92.0
      ]
    ],
    "wallKey": "building:B_LANGKASUKA"
  },
  {
    "id": "B_SERAMBI",
    "name": "Serambi Aktiviti Pelajar",
    "category": "hub",
    "zoneId": "student-life",
    "emoji": "✨",
    "description": {
      "zh": "学生活动中心，设有开放式内庭，内设学生事务处（HEP）、辅导室与活动空间。",
      "ms": "Pusat aktiviti pelajar dengan ruang dalaman terbuka. Termasuk Pejabat HEP, kaunseling dan ruang aktiviti.",
      "en": "Student activity hub with an open central courtyard. Houses the Student Affairs Office (HEP), counselling services and activity spaces."
    },
    "tags": {
      "zh": [
        "学生事务处",
        "辅导",
        "学生",
        "活动"
      ],
      "ms": [
        "HEP",
        "kaunseling",
        "pelajar",
        "aktiviti"
      ],
      "en": [
        "student affairs",
        "counselling",
        "students",
        "activities"
      ]
    },
    "floors": 2,
    "hours": "Isnin–Jumaat 08:00–17:00",
    "center": [
      -249.325,
      -141.025
    ],
    "overviewPolygon": [
      [
        8.0,
        91.28
      ],
      [
        90.18,
        92.0
      ],
      [
        90.95,
        57.63
      ],
      [
        92.0,
        8.72
      ],
      [
        9.89,
        8.0
      ]
    ],
    "wallKey": "building:B_SERAMBI"
  },
  {
    "id": "B_GARAJ",
    "name": "Garaj Bas",
    "category": "admin",
    "zoneId": "services",
    "emoji": "🚌",
    "description": {
      "zh": "校车车库与停放处。",
      "ms": "Garaj dan tempat letak bas kolej.",
      "en": "Garage and parking bay for the college buses."
    },
    "tags": {
      "zh": [
        "巴士",
        "交通",
        "车库"
      ],
      "ms": [
        "bas",
        "pengangkutan",
        "garaj"
      ],
      "en": [
        "bus",
        "transport",
        "garage"
      ]
    },
    "floors": 1,
    "hours": "06:00–22:00",
    "center": [
      162.56,
      -91.225
    ],
    "overviewPolygon": [
      [
        8.15,
        92.0
      ],
      [
        8.0,
        36.52
      ],
      [
        28.27,
        35.8
      ],
      [
        28.18,
        10.14
      ],
      [
        91.78,
        8.0
      ],
      [
        92.0,
        89.08
      ]
    ],
    "wallKey": "building:B_GARAJ"
  },
  {
    "id": "B_ASTAKA",
    "name": "Astaka",
    "category": "sports",
    "zoneId": "sports",
    "emoji": "🏟️",
    "description": {
      "zh": "主看台，正对操场和田径跑道。",
      "ms": "Astaka utama menghadap padang dan litar olahraga.",
      "en": "The main pavilion overlooking the field and running track."
    },
    "tags": {
      "zh": [
        "体育",
        "看台",
        "集会"
      ],
      "ms": [
        "sukan",
        "astaka",
        "perhimpunan"
      ],
      "en": [
        "sports",
        "pavilion",
        "assembly"
      ]
    },
    "floors": 2,
    "hours": "06:00–22:00",
    "center": [
      -247.54,
      -294.01
    ],
    "overviewPolygon": [
      [
        8.26,
        92.0
      ],
      [
        8.0,
        8.2
      ],
      [
        72.99,
        8.03
      ],
      [
        91.71,
        8.0
      ],
      [
        92.0,
        91.86
      ],
      [
        58.94,
        91.92
      ]
    ],
    "wallKey": "building:B_ASTAKA"
  },
  {
    "id": "B_SERI_LAKA",
    "name": "Kediaman Seri Laka",
    "category": "residence_m",
    "zoneId": "residence",
    "emoji": "🛏️",
    "description": {
      "zh": "Seri Laka 宿舍——主要学生宿舍群，设有开放式内庭，每层都有连廊。",
      "ms": "Kediaman Seri Laka — kompleks asrama pelajar utama dengan laman dalaman terbuka dan selasar di setiap aras.",
      "en": "Kediaman Seri Laka — the main student residential complex, with open internal courtyards and a corridor on every floor."
    },
    "tags": {
      "zh": [
        "宿舍",
        "Seri Laka",
        "宿舍",
        "学生"
      ],
      "ms": [
        "asrama",
        "seri laka",
        "kediaman",
        "pelajar"
      ],
      "en": [
        "dormitory",
        "Seri Laka",
        "residence",
        "students"
      ]
    },
    "floors": 4,
    "hours": "24 jam (residen sahaja)",
    "center": [
      78.505,
      -15.82
    ],
    "overviewPolygon": [
      [
        11.57,
        33.45
      ],
      [
        11.56,
        36.61
      ],
      [
        8.25,
        36.57
      ],
      [
        8.24,
        40.05
      ],
      [
        11.69,
        40.1
      ],
      [
        11.68,
        42.21
      ],
      [
        9.08,
        42.19
      ],
      [
        8.97,
        84.39
      ],
      [
        11.43,
        84.41
      ],
      [
        11.43,
        86.54
      ],
      [
        8.01,
        86.52
      ],
      [
        8.0,
        89.83
      ],
      [
        11.62,
        89.86
      ],
      [
        11.62,
        91.87
      ],
      [
        34.15,
        92.0
      ],
      [
        34.16,
        90.11
      ],
      [
        36.49,
        90.13
      ],
      [
        36.5,
        86.96
      ],
      [
        34.34,
        86.95
      ],
      [
        34.34,
        84.05
      ],
      [
        37.24,
        84.06
      ],
      [
        37.26,
        49.31
      ],
      [
        34.92,
        49.31
      ],
      [
        34.92,
        43.85
      ],
      [
        43.51,
        43.86
      ],
      [
        43.51,
        45.17
      ],
      [
        44.66,
        45.25
      ],
      [
        47.16,
        45.2
      ],
      [
        50.54,
        45.16
      ],
      [
        50.54,
        43.76
      ],
      [
        59.59,
        43.75
      ],
      [
        59.58,
        39.3
      ],
      [
        60.8,
        39.3
      ],
      [
        60.82,
        59.8
      ],
      [
        59.67,
        59.8
      ],
      [
        59.68,
        64.93
      ],
      [
        90.01,
        64.8
      ],
      [
        90.01,
        60.85
      ],
      [
        92.0,
        60.83
      ],
      [
        91.94,
        13.46
      ],
      [
        90.35,
        13.48
      ],
      [
        90.34,
        8.0
      ],
      [
        75.82,
        8.09
      ],
      [
        60.99,
        8.17
      ],
      [
        61.03,
        33.39
      ],
      [
        60.53,
        33.39
      ],
      [
        60.52,
        29.15
      ],
      [
        51.17,
        29.22
      ],
      [
        51.16,
        27.07
      ],
      [
        42.09,
        27.13
      ],
      [
        42.1,
        28.66
      ],
      [
        32.52,
        28.73
      ],
      [
        32.53,
        35.47
      ],
      [
        30.44,
        39.1
      ],
      [
        25.44,
        39.04
      ],
      [
        25.46,
        33.63
      ]
    ],
    "wallKey": "building:B_SERI_LAKA"
  },
  {
    "id": "B_SERI_PALAS",
    "name": "Kediaman Seri Palas",
    "category": "residence",
    "zoneId": "residence",
    "emoji": "🛏️",
    "description": {
      "zh": "Seri Palas 宿舍——学生宿舍楼之一，设有开放式内庭，每层都有连廊。",
      "ms": "Kediaman Seri Palas — salah satu blok kediaman pelajar dengan laman dalaman terbuka dan selasar di setiap aras.",
      "en": "Kediaman Seri Palas — one of the student residential blocks, with an open internal courtyard and a corridor on every floor."
    },
    "tags": {
      "zh": [
        "宿舍",
        "Seri Palas",
        "宿舍",
        "学生"
      ],
      "ms": [
        "asrama",
        "seri palas",
        "kediaman",
        "pelajar"
      ],
      "en": [
        "dormitory",
        "Seri Palas",
        "residence",
        "students"
      ]
    },
    "floors": 4,
    "hours": "24 jam (residen sahaja)",
    "center": [
      -116.315,
      108.08
    ],
    "overviewPolygon": [
      [
        11.38,
        65.8
      ],
      [
        11.38,
        62.67
      ],
      [
        8.07,
        62.67
      ],
      [
        8.07,
        59.23
      ],
      [
        11.52,
        59.23
      ],
      [
        11.52,
        57.14
      ],
      [
        8.92,
        57.12
      ],
      [
        8.95,
        15.36
      ],
      [
        11.42,
        15.38
      ],
      [
        11.42,
        13.27
      ],
      [
        8.0,
        13.25
      ],
      [
        8.0,
        9.96
      ],
      [
        11.62,
        9.99
      ],
      [
        11.63,
        8.0
      ],
      [
        34.19,
        8.14
      ],
      [
        34.19,
        10.02
      ],
      [
        36.53,
        10.04
      ],
      [
        36.52,
        13.17
      ],
      [
        34.36,
        13.15
      ],
      [
        34.35,
        16.02
      ],
      [
        37.25,
        16.05
      ],
      [
        37.15,
        50.44
      ],
      [
        34.81,
        50.4
      ],
      [
        34.79,
        55.81
      ],
      [
        43.4,
        55.92
      ],
      [
        43.4,
        54.62
      ],
      [
        45.54,
        54.59
      ],
      [
        47.53,
        54.56
      ],
      [
        50.45,
        54.72
      ],
      [
        50.44,
        56.1
      ],
      [
        59.48,
        56.22
      ],
      [
        59.47,
        60.62
      ],
      [
        60.69,
        60.64
      ],
      [
        60.78,
        40.36
      ],
      [
        59.63,
        40.34
      ],
      [
        59.65,
        35.26
      ],
      [
        90.02,
        35.78
      ],
      [
        90.01,
        39.69
      ],
      [
        92.0,
        39.73
      ],
      [
        91.77,
        86.6
      ],
      [
        90.18,
        86.56
      ],
      [
        90.16,
        92.0
      ],
      [
        75.86,
        91.73
      ],
      [
        60.78,
        91.45
      ],
      [
        60.9,
        66.5
      ],
      [
        60.4,
        66.49
      ],
      [
        60.38,
        70.68
      ],
      [
        51.0,
        70.5
      ],
      [
        50.99,
        72.62
      ],
      [
        41.92,
        72.44
      ],
      [
        41.93,
        70.93
      ],
      [
        32.34,
        70.75
      ],
      [
        32.37,
        64.07
      ],
      [
        30.8,
        61.34
      ],
      [
        30.3,
        60.46
      ],
      [
        25.29,
        60.46
      ],
      [
        25.29,
        65.81
      ]
    ],
    "wallKey": "building:B_SERI_PALAS"
  },
  {
    "id": "B_SERI_TEMIN",
    "name": "Kediaman Seri Temin",
    "category": "residence",
    "zoneId": "residence",
    "emoji": "🛏️",
    "description": {
      "zh": "Seri Temin 宿舍——学生宿舍楼，设有开放式内庭，每层都有连廊。",
      "ms": "Kediaman Seri Temin — blok kediaman pelajar dengan laman dalaman terbuka dan selasar di setiap aras.",
      "en": "Kediaman Seri Temin — a student residential block with an open internal courtyard and a corridor on every floor."
    },
    "tags": {
      "zh": [
        "宿舍",
        "Seri Temin",
        "宿舍",
        "学生"
      ],
      "ms": [
        "asrama",
        "seri temin",
        "kediaman",
        "pelajar"
      ],
      "en": [
        "dormitory",
        "Seri Temin",
        "residence",
        "students"
      ]
    },
    "floors": 4,
    "hours": "24 jam (residen sahaja)",
    "center": [
      76.845,
      88.36500000000001
    ],
    "overviewPolygon": [
      [
        11.38,
        65.8
      ],
      [
        11.38,
        62.68
      ],
      [
        8.07,
        62.68
      ],
      [
        8.07,
        59.23
      ],
      [
        11.52,
        59.24
      ],
      [
        11.52,
        57.15
      ],
      [
        8.92,
        57.14
      ],
      [
        8.95,
        15.37
      ],
      [
        11.42,
        15.37
      ],
      [
        11.42,
        13.26
      ],
      [
        8.0,
        13.25
      ],
      [
        8.0,
        9.97
      ],
      [
        11.63,
        9.99
      ],
      [
        11.63,
        8.0
      ],
      [
        34.19,
        8.14
      ],
      [
        34.19,
        10.02
      ],
      [
        36.53,
        10.04
      ],
      [
        36.52,
        13.18
      ],
      [
        34.36,
        13.15
      ],
      [
        34.35,
        16.02
      ],
      [
        37.25,
        16.05
      ],
      [
        37.15,
        50.44
      ],
      [
        34.81,
        50.41
      ],
      [
        34.79,
        55.82
      ],
      [
        43.39,
        55.91
      ],
      [
        43.4,
        54.63
      ],
      [
        46.26,
        54.54
      ],
      [
        48.26,
        54.49
      ],
      [
        50.44,
        54.72
      ],
      [
        50.44,
        56.1
      ],
      [
        59.48,
        56.23
      ],
      [
        59.47,
        60.63
      ],
      [
        60.69,
        60.64
      ],
      [
        60.78,
        40.37
      ],
      [
        59.63,
        40.34
      ],
      [
        59.65,
        35.27
      ],
      [
        90.02,
        35.78
      ],
      [
        90.01,
        39.7
      ],
      [
        92.0,
        39.73
      ],
      [
        91.77,
        86.61
      ],
      [
        90.18,
        86.58
      ],
      [
        90.16,
        92.0
      ],
      [
        76.81,
        91.75
      ],
      [
        60.78,
        91.46
      ],
      [
        60.9,
        66.51
      ],
      [
        60.4,
        66.5
      ],
      [
        60.38,
        70.69
      ],
      [
        51.0,
        70.51
      ],
      [
        50.99,
        72.62
      ],
      [
        41.92,
        72.45
      ],
      [
        41.93,
        70.94
      ],
      [
        32.34,
        70.77
      ],
      [
        32.38,
        64.08
      ],
      [
        31.34,
        62.27
      ],
      [
        30.3,
        60.46
      ],
      [
        25.28,
        60.45
      ],
      [
        25.28,
        65.81
      ]
    ],
    "wallKey": "building:B_SERI_TEMIN"
  },
  {
    "id": "B_SERI_JERAI",
    "name": "Bangunan Seri Jerai",
    "category": "academic",
    "zoneId": "learning",
    "emoji": "🏫",
    "description": {
      "zh": "Seri Jerai 楼——学术楼，设有讲堂与学生活动空间。",
      "ms": "Bangunan Seri Jerai — blok akademik yang menempatkan bilik kuliah dan ruang aktiviti pelajar.",
      "en": "Bangunan Seri Jerai — an academic block housing lecture rooms and student activity spaces."
    },
    "tags": {
      "zh": [
        "学术",
        "Seri Jerai",
        "授课"
      ],
      "ms": [
        "akademik",
        "seri jerai",
        "kuliah"
      ],
      "en": [
        "academic",
        "Seri Jerai",
        "lectures"
      ]
    },
    "floors": 3,
    "hours": "Isnin–Sabtu 07:30–18:00",
    "center": [
      -247.695,
      -149.87
    ],
    "overviewPolygon": [
      [
        8.0,
        91.26
      ],
      [
        8.08,
        83.7
      ],
      [
        8.25,
        62.62
      ],
      [
        8.74,
        8.0
      ],
      [
        43.45,
        8.29
      ],
      [
        43.36,
        18.69
      ],
      [
        43.34,
        21.58
      ],
      [
        40.8,
        21.66
      ],
      [
        36.34,
        21.62
      ],
      [
        35.9,
        62.06
      ],
      [
        77.1,
        62.5
      ],
      [
        77.14,
        59.7
      ],
      [
        81.39,
        59.75
      ],
      [
        92.0,
        59.9
      ],
      [
        91.72,
        92.0
      ]
    ],
    "wallKey": "building:B_SERI_JERAI"
  },
  {
    "id": "B_BLOK_KETUA_JABATAN",
    "name": "Blok Kediaman Ketua Jabatan",
    "category": "staff_house",
    "zoneId": "services",
    "emoji": "🏠",
    "description": {
      "zh": "系主任宿舍楼——KMK 各系系主任的官方住所。",
      "ms": "Blok Kediaman Ketua Jabatan — kediaman rasmi untuk ketua-ketua jabatan KMK.",
      "en": "Blok Kediaman Ketua Jabatan — official housing for KMK's heads of department."
    },
    "tags": {
      "zh": [
        "宿舍",
        "系主任",
        "教职员"
      ],
      "ms": [
        "kediaman",
        "ketua jabatan",
        "staf"
      ],
      "en": [
        "residence",
        "head of department",
        "staff"
      ]
    },
    "floors": 2,
    "hours": "Kediaman peribadi",
    "center": [
      315.105,
      97.00999999999999
    ],
    "overviewPolygon": [
      [
        56.35,
        92.0
      ],
      [
        50.91,
        83.48
      ],
      [
        46.48,
        85.03
      ],
      [
        38.03,
        71.73
      ],
      [
        40.97,
        70.69
      ],
      [
        36.28,
        63.35
      ],
      [
        49.35,
        58.77
      ],
      [
        42.04,
        47.25
      ],
      [
        29.09,
        51.8
      ],
      [
        23.87,
        43.61
      ],
      [
        19.93,
        44.96
      ],
      [
        10.28,
        29.77
      ],
      [
        12.84,
        28.87
      ],
      [
        8.0,
        21.24
      ],
      [
        45.81,
        8.0
      ],
      [
        65.05,
        38.27
      ],
      [
        56.8,
        41.18
      ],
      [
        57.91,
        42.96
      ],
      [
        66.4,
        39.98
      ],
      [
        72.22,
        49.12
      ],
      [
        63.27,
        52.25
      ],
      [
        64.36,
        54.0
      ],
      [
        73.69,
        50.72
      ],
      [
        92.0,
        79.53
      ]
    ],
    "wallKey": "building:B_BLOK_KETUA_JABATAN"
  },
  {
    "id": "B_KP_P1",
    "name": "Kediaman Pensyarah P1",
    "category": "staff_house",
    "zoneId": "services",
    "emoji": "🏡",
    "description": {
      "zh": "P1 讲师宿舍——位于校园东侧、Jalan Bunga Lawang 沿线的讲师与教职员住所。",
      "ms": "Kediaman Pensyarah P1 — kediaman pensyarah dan staf akademik di zon timur kampus, sepanjang Jalan Bunga Lawang.",
      "en": "Kediaman Pensyarah P1 — lecturer and academic staff housing on the eastern side of campus, along Jalan Bunga Lawang."
    },
    "tags": {
      "zh": [
        "宿舍",
        "讲师",
        "教职员"
      ],
      "ms": [
        "kediaman",
        "pensyarah",
        "staf"
      ],
      "en": [
        "residence",
        "lecturer",
        "staff"
      ]
    },
    "floors": 2,
    "hours": "Kawasan kediaman",
    "center": [
      206.365,
      116.07999999999998
    ],
    "overviewPolygon": [
      [
        8.0,
        73.38
      ],
      [
        22.16,
        41.58
      ],
      [
        29.48,
        44.04
      ],
      [
        31.01,
        40.59
      ],
      [
        23.6,
        38.09
      ],
      [
        37.01,
        8.0
      ],
      [
        52.66,
        13.27
      ],
      [
        50.09,
        19.03
      ],
      [
        69.11,
        25.46
      ],
      [
        71.53,
        20.02
      ],
      [
        92.0,
        26.89
      ],
      [
        77.82,
        58.67
      ],
      [
        59.82,
        52.63
      ],
      [
        59.03,
        54.35
      ],
      [
        76.27,
        60.17
      ],
      [
        62.1,
        92.0
      ],
      [
        38.75,
        84.12
      ],
      [
        40.97,
        79.13
      ],
      [
        30.81,
        75.71
      ],
      [
        28.72,
        80.38
      ]
    ],
    "wallKey": "building:B_KP_P1"
  },
  {
    "id": "B_KP_P2",
    "name": "Kediaman Pensyarah P2",
    "category": "staff_house",
    "zoneId": "services",
    "emoji": "🏡",
    "description": {
      "zh": "P2 讲师宿舍——位于校园东侧、Jalan Bunga Lawang 沿线的讲师与教职员住所。",
      "ms": "Kediaman Pensyarah P2 — kediaman pensyarah dan staf akademik di zon timur kampus, sepanjang Jalan Bunga Lawang.",
      "en": "Kediaman Pensyarah P2 — lecturer and academic staff housing on the eastern side of campus, along Jalan Bunga Lawang."
    },
    "tags": {
      "zh": [
        "宿舍",
        "讲师",
        "教职员"
      ],
      "ms": [
        "kediaman",
        "pensyarah",
        "staf"
      ],
      "en": [
        "residence",
        "lecturer",
        "staff"
      ]
    },
    "floors": 2,
    "hours": "Kawasan kediaman",
    "center": [
      258.74,
      67.92999999999999
    ],
    "overviewPolygon": [
      [
        92.0,
        58.58
      ],
      [
        61.61,
        74.81
      ],
      [
        58.71,
        68.0
      ],
      [
        55.4,
        69.77
      ],
      [
        58.35,
        76.66
      ],
      [
        29.58,
        92.0
      ],
      [
        23.37,
        77.48
      ],
      [
        28.87,
        74.54
      ],
      [
        21.33,
        56.85
      ],
      [
        16.14,
        59.62
      ],
      [
        8.0,
        40.64
      ],
      [
        38.41,
        24.41
      ],
      [
        45.56,
        41.14
      ],
      [
        47.21,
        40.26
      ],
      [
        40.38,
        24.23
      ],
      [
        70.8,
        8.0
      ],
      [
        80.06,
        29.68
      ],
      [
        75.29,
        32.24
      ],
      [
        79.33,
        41.7
      ],
      [
        83.77,
        39.31
      ]
    ],
    "wallKey": "building:B_KP_P2"
  },
  {
    "id": "B_KP_P3",
    "name": "Kediaman Pensyarah P3",
    "category": "staff_house",
    "zoneId": "services",
    "emoji": "🏡",
    "description": {
      "zh": "P3 讲师宿舍——位于校园东侧、Jalan Bunga Lawang 沿线的讲师与教职员住所。",
      "ms": "Kediaman Pensyarah P3 — kediaman pensyarah dan staf akademik di zon timur kampus, sepanjang Jalan Bunga Lawang.",
      "en": "Kediaman Pensyarah P3 — lecturer and academic staff housing on the eastern side of campus, along Jalan Bunga Lawang."
    },
    "tags": {
      "zh": [
        "宿舍",
        "讲师",
        "教职员"
      ],
      "ms": [
        "kediaman",
        "pensyarah",
        "staf"
      ],
      "en": [
        "residence",
        "lecturer",
        "staff"
      ]
    },
    "floors": 2,
    "hours": "Kawasan kediaman",
    "center": [
      259.88,
      13.760000000000002
    ],
    "overviewPolygon": [
      [
        92.0,
        36.55
      ],
      [
        59.75,
        22.71
      ],
      [
        57.35,
        30.17
      ],
      [
        53.85,
        28.66
      ],
      [
        56.28,
        21.11
      ],
      [
        25.74,
        8.0
      ],
      [
        20.6,
        23.92
      ],
      [
        26.47,
        26.44
      ],
      [
        20.22,
        45.85
      ],
      [
        14.7,
        43.48
      ],
      [
        8.0,
        64.31
      ],
      [
        40.23,
        78.17
      ],
      [
        46.15,
        59.8
      ],
      [
        47.93,
        60.57
      ],
      [
        42.28,
        78.11
      ],
      [
        74.53,
        92.0
      ],
      [
        82.19,
        68.21
      ],
      [
        77.15,
        66.03
      ],
      [
        80.47,
        55.66
      ],
      [
        85.21,
        57.7
      ]
    ],
    "wallKey": "building:B_KP_P3"
  },
  {
    "id": "B_KP_P4",
    "name": "Kediaman Pensyarah P4",
    "category": "staff_house",
    "zoneId": "services",
    "emoji": "🏡",
    "description": {
      "zh": "P4 讲师宿舍——位于校园东侧、Jalan Bunga Lawang 沿线的讲师与教职员住所。",
      "ms": "Kediaman Pensyarah P4 — kediaman pensyarah dan staf akademik di zon timur kampus, sepanjang Jalan Bunga Lawang.",
      "en": "Kediaman Pensyarah P4 — lecturer and academic staff housing on the eastern side of campus, along Jalan Bunga Lawang."
    },
    "tags": {
      "zh": [
        "宿舍",
        "讲师",
        "教职员"
      ],
      "ms": [
        "kediaman",
        "pensyarah",
        "staf"
      ],
      "en": [
        "residence",
        "lecturer",
        "staff"
      ]
    },
    "floors": 2,
    "hours": "Kawasan kediaman",
    "center": [
      209.155,
      -30.47
    ],
    "overviewPolygon": [
      [
        8.0,
        26.01
      ],
      [
        21.77,
        58.11
      ],
      [
        29.2,
        55.73
      ],
      [
        30.69,
        59.21
      ],
      [
        23.17,
        61.63
      ],
      [
        36.2,
        92.0
      ],
      [
        52.08,
        86.91
      ],
      [
        49.59,
        81.09
      ],
      [
        68.92,
        74.87
      ],
      [
        71.28,
        80.38
      ],
      [
        92.0,
        73.72
      ],
      [
        78.23,
        41.62
      ],
      [
        59.98,
        47.51
      ],
      [
        59.2,
        45.74
      ],
      [
        76.69,
        40.12
      ],
      [
        62.92,
        8.0
      ],
      [
        39.23,
        15.61
      ],
      [
        41.38,
        20.65
      ],
      [
        31.06,
        23.97
      ],
      [
        29.04,
        19.27
      ]
    ],
    "wallKey": "building:B_KP_P4"
  },
  {
    "id": "B_KEDIAMAN_PENGARAH",
    "name": "Kediaman Pengarah",
    "category": "staff_house",
    "zoneId": "services",
    "emoji": "🏡",
    "description": {
      "zh": "KMK 院长官邸，位于校园东南角。",
      "ms": "Kediaman rasmi Pengarah KMK di sudut tenggara kampus.",
      "en": "The official residence of the KMK Director, at the southeast corner of campus."
    },
    "tags": {
      "zh": [
        "宿舍",
        "院长",
        "主任"
      ],
      "ms": [
        "kediaman",
        "pengarah",
        "direktur"
      ],
      "en": [
        "residence",
        "director",
        "director"
      ]
    },
    "floors": 2,
    "hours": "Kawasan kediaman",
    "center": [
      275.35,
      131.6
    ],
    "overviewPolygon": [
      [
        36.0,
        82.68
      ],
      [
        8.0,
        56.16
      ],
      [
        63.74,
        8.0
      ],
      [
        92.0,
        34.76
      ],
      [
        68.12,
        55.35
      ],
      [
        86.29,
        72.55
      ],
      [
        63.68,
        92.0
      ],
      [
        45.4,
        74.66
      ]
    ],
    "wallKey": "building:B_KEDIAMAN_PENGARAH"
  },
  {
    "id": "B_KAFETERIA_A",
    "name": "Kafeteria A",
    "category": "dining",
    "zoneId": "residence",
    "emoji": "🍽️",
    "description": {
      "zh": "A 食堂——学生主要食堂之一，供应早餐、午餐与晚餐。",
      "ms": "Kafeteria A — salah satu kafeteria utama pelajar untuk sarapan, makan tengah hari dan makan malam.",
      "en": "Kafeteria A — one of the main student cafeterias, serving breakfast, lunch and dinner."
    },
    "tags": {
      "zh": [
        "食堂",
        "用餐",
        "学生"
      ],
      "ms": [
        "kafeteria",
        "makan",
        "pelajar"
      ],
      "en": [
        "cafeteria",
        "dining",
        "students"
      ]
    },
    "floors": 1,
    "hours": "06:30–22:00",
    "center": [
      -116.1,
      137.215
    ],
    "overviewPolygon": [
      [
        29.19,
        92.0
      ],
      [
        28.66,
        70.28
      ],
      [
        9.58,
        70.45
      ],
      [
        8.0,
        8.74
      ],
      [
        90.45,
        8.0
      ],
      [
        92.0,
        69.07
      ],
      [
        73.36,
        69.24
      ],
      [
        73.92,
        91.61
      ],
      [
        55.21,
        91.74
      ],
      [
        42.28,
        91.83
      ]
    ],
    "wallKey": "building:B_KAFETERIA_A"
  },
  {
    "id": "B_KAFETERIA_B",
    "name": "Kafeteria B",
    "category": "dining",
    "zoneId": "residence",
    "emoji": "🍽️",
    "description": {
      "zh": "B 食堂——靠近宿舍的学生食堂，课余时间的热门去处。",
      "ms": "Kafeteria B — kafeteria pelajar berhampiran kediaman, tumpuan pelajar waktu rehat.",
      "en": "Kafeteria B — a student cafeteria near the residential halls, a popular spot between classes."
    },
    "tags": {
      "zh": [
        "食堂",
        "用餐",
        "学生"
      ],
      "ms": [
        "kafeteria",
        "makan",
        "pelajar"
      ],
      "en": [
        "cafeteria",
        "dining",
        "students"
      ]
    },
    "floors": 1,
    "hours": "06:30–22:00",
    "center": [
      77.055,
      117.225
    ],
    "overviewPolygon": [
      [
        29.16,
        92.0
      ],
      [
        28.67,
        70.28
      ],
      [
        9.55,
        70.47
      ],
      [
        8.0,
        8.74
      ],
      [
        90.48,
        8.0
      ],
      [
        92.0,
        69.07
      ],
      [
        73.38,
        69.24
      ],
      [
        73.91,
        91.57
      ],
      [
        56.31,
        91.74
      ],
      [
        41.85,
        91.87
      ]
    ],
    "wallKey": "building:B_KAFETERIA_B"
  },
  {
    "id": "B_KAFETERIA_C",
    "name": "Kafeteria C",
    "category": "dining",
    "zoneId": "residence",
    "emoji": "🍽️",
    "description": {
      "zh": "C 食堂——靠近清真寺的学生食堂，常是礼拜后大家聚集的地方。",
      "ms": "Kafeteria C — kafeteria pelajar berhampiran Masjid, sering menjadi tempat berkumpul selepas solat.",
      "en": "Kafeteria C — a student cafeteria near the mosque, often the gathering spot right after prayers."
    },
    "tags": {
      "zh": [
        "食堂",
        "用餐",
        "学生"
      ],
      "ms": [
        "kafeteria",
        "makan",
        "pelajar"
      ],
      "en": [
        "cafeteria",
        "dining",
        "students"
      ]
    },
    "floors": 1,
    "hours": "06:30–22:00",
    "center": [
      77.34,
      -48.864999999999995
    ],
    "overviewPolygon": [
      [
        26.52,
        8.41
      ],
      [
        27.08,
        30.12
      ],
      [
        8.0,
        30.31
      ],
      [
        9.55,
        92.0
      ],
      [
        92.0,
        91.22
      ],
      [
        90.45,
        30.18
      ],
      [
        71.84,
        30.34
      ],
      [
        71.25,
        8.0
      ],
      [
        55.77,
        8.13
      ],
      [
        42.18,
        8.26
      ]
    ],
    "wallKey": "building:B_KAFETERIA_C"
  },
  {
    "id": "B_KAFETERIA_PENTADBIRAN",
    "name": "Kafeteria Pentadbiran",
    "category": "cafe",
    "zoneId": "residence",
    "emoji": "☕",
    "description": {
      "zh": "行政食堂——KMK 行政人员与讲师的用餐空间。",
      "ms": "Kafeteria Pentadbiran — ruang makan untuk kakitangan pentadbiran dan pensyarah KMK.",
      "en": "Kafeteria Pentadbiran — a dining space for KMK's administrative staff and lecturers."
    },
    "tags": {
      "zh": [
        "食堂",
        "行政",
        "教职员"
      ],
      "ms": [
        "kafeteria",
        "pentadbiran",
        "staf"
      ],
      "en": [
        "cafeteria",
        "admin",
        "staff"
      ]
    },
    "floors": 1,
    "hours": "07:30–17:00",
    "center": [
      -233.38,
      -110.93
    ],
    "overviewPolygon": [
      [
        8.0,
        82.92
      ],
      [
        8.0,
        8.0
      ],
      [
        92.0,
        8.0
      ],
      [
        92.0,
        92.0
      ],
      [
        20.39,
        91.92
      ],
      [
        20.39,
        82.92
      ]
    ],
    "wallKey": "building:B_KAFETERIA_PENTADBIRAN"
  },
  {
    "id": "B_PENCAWANG_1",
    "name": "Pencawang Elektrik 1",
    "category": "admin",
    "zoneId": "services",
    "emoji": "⚡",
    "description": {
      "zh": "校园变电站——KMK 的电力供应设施。",
      "ms": "Pencawang elektrik kampus — infrastruktur bekalan kuasa KMK.",
      "en": "Campus electrical substation — part of KMK's power supply infrastructure."
    },
    "tags": {
      "zh": [
        "设施",
        "电力"
      ],
      "ms": [
        "utiliti",
        "elektrik"
      ],
      "en": [
        "utility",
        "electrical"
      ]
    },
    "floors": 1,
    "hours": "Kawasan larangan",
    "center": [
      -328.12,
      67.185
    ],
    "overviewPolygon": [
      [
        9.69,
        92.0
      ],
      [
        8.0,
        65.27
      ],
      [
        19.15,
        65.22
      ],
      [
        15.36,
        8.26
      ],
      [
        86.43,
        8.0
      ],
      [
        92.0,
        91.72
      ]
    ],
    "wallKey": "building:B_PENCAWANG_1"
  },
  {
    "id": "B_PENCAWANG_2",
    "name": "Pencawang Elektrik 2",
    "category": "admin",
    "zoneId": "services",
    "emoji": "⚡",
    "description": {
      "zh": "校园变电站——KMK 的电力供应设施。",
      "ms": "Pencawang elektrik kampus — infrastruktur bekalan kuasa KMK.",
      "en": "Campus electrical substation — part of KMK's power supply infrastructure."
    },
    "tags": {
      "zh": [
        "设施",
        "电力"
      ],
      "ms": [
        "utiliti",
        "elektrik"
      ],
      "en": [
        "utility",
        "electrical"
      ]
    },
    "floors": 1,
    "hours": "Kawasan larangan",
    "center": [
      151.935,
      138.08499999999998
    ],
    "overviewPolygon": [
      [
        9.07,
        92.0
      ],
      [
        8.0,
        14.16
      ],
      [
        90.98,
        8.0
      ],
      [
        92.0,
        85.84
      ]
    ],
    "wallKey": "building:B_PENCAWANG_2"
  },
  {
    "id": "B_BLOK_TUTORAN_MAKMAL",
    "name": "Blok Tutoran dan Makmal Sains",
    "category": "academic",
    "zoneId": "learning",
    "emoji": "🔬",
    "description": {
      "zh": "导修与科学实验楼——设有导修室与科学实验室，中央为开放式庭院。",
      "ms": "Blok Tutoran dan Makmal Sains — bilik tutorial dan makmal sains dengan laman dalaman terbuka.",
      "en": "Blok Tutoran dan Makmal Sains — tutorial rooms and science laboratories built around an open central courtyard."
    },
    "tags": {
      "zh": [
        "实验室",
        "导修",
        "科学",
        "学术"
      ],
      "ms": [
        "makmal",
        "tutorial",
        "sains",
        "akademik"
      ],
      "en": [
        "lab",
        "tutorial",
        "science",
        "academic"
      ]
    },
    "floors": 3,
    "hours": "Isnin–Sabtu 07:30–18:00",
    "center": [
      -165.745,
      -34.864999999999995
    ],
    "overviewPolygon": [
      [
        10.85,
        91.98
      ],
      [
        10.85,
        89.72
      ],
      [
        8.91,
        89.72
      ],
      [
        8.92,
        80.73
      ],
      [
        10.4,
        80.73
      ],
      [
        10.4,
        76.72
      ],
      [
        8.83,
        76.72
      ],
      [
        8.85,
        68.73
      ],
      [
        10.95,
        68.73
      ],
      [
        11.01,
        53.1
      ],
      [
        16.6,
        53.11
      ],
      [
        16.61,
        50.59
      ],
      [
        16.63,
        47.64
      ],
      [
        9.72,
        47.63
      ],
      [
        9.78,
        31.73
      ],
      [
        8.0,
        31.72
      ],
      [
        8.02,
        23.37
      ],
      [
        10.48,
        23.38
      ],
      [
        10.54,
        8.0
      ],
      [
        78.75,
        8.18
      ],
      [
        78.75,
        10.78
      ],
      [
        90.81,
        10.81
      ],
      [
        90.79,
        20.24
      ],
      [
        87.13,
        20.24
      ],
      [
        87.13,
        22.34
      ],
      [
        91.59,
        22.35
      ],
      [
        91.56,
        45.4
      ],
      [
        82.5,
        45.39
      ],
      [
        82.49,
        50.83
      ],
      [
        82.49,
        54.26
      ],
      [
        92.0,
        54.27
      ],
      [
        91.97,
        77.65
      ],
      [
        86.59,
        77.65
      ],
      [
        86.59,
        79.42
      ],
      [
        90.62,
        79.42
      ],
      [
        90.62,
        89.99
      ],
      [
        79.6,
        89.99
      ],
      [
        79.6,
        92.0
      ]
    ],
    "wallKey": "building:B_BLOK_TUTORAN_MAKMAL"
  },
  {
    "id": "B_BLOK_AKADEMIK_S",
    "name": "Blok Akademik Selatan",
    "category": "academic",
    "zoneId": "learning",
    "emoji": "🏫",
    "description": {
      "zh": "南学术楼——导修室、科学实验室与讲师办公室环绕中央庭院。",
      "ms": "Blok Akademik Selatan — bilik tutorial, makmal sains atau bilik pensyarah mengelilingi laman dalaman.",
      "en": "South Academic Block — tutorial rooms, science laboratories and lecturer offices arranged around a central courtyard."
    },
    "tags": {
      "zh": [
        "导修",
        "实验室",
        "学术"
      ],
      "ms": [
        "tutorial",
        "makmal",
        "akademik"
      ],
      "en": [
        "tutorial",
        "lab",
        "academic"
      ]
    },
    "floors": 3,
    "hours": "Isnin–Sabtu 07:30–18:00",
    "center": [
      -182.8,
      -293.365
    ],
    "overviewPolygon": [
      [
        12.49,
        79.53
      ],
      [
        8.28,
        79.53
      ],
      [
        8.09,
        37.3
      ],
      [
        8.0,
        18.2
      ],
      [
        14.16,
        18.13
      ],
      [
        16.93,
        15.94
      ],
      [
        21.4,
        13.51
      ],
      [
        27.73,
        11.08
      ],
      [
        34.66,
        9.22
      ],
      [
        41.14,
        8.32
      ],
      [
        48.22,
        8.0
      ],
      [
        55.78,
        8.0
      ],
      [
        61.79,
        8.89
      ],
      [
        63.78,
        9.3
      ],
      [
        68.42,
        10.27
      ],
      [
        74.89,
        12.38
      ],
      [
        79.97,
        14.97
      ],
      [
        84.44,
        17.8
      ],
      [
        87.53,
        20.55
      ],
      [
        89.84,
        23.55
      ],
      [
        91.23,
        27.28
      ],
      [
        92.0,
        71.35
      ],
      [
        90.31,
        76.77
      ],
      [
        88.84,
        78.46
      ],
      [
        85.83,
        81.87
      ],
      [
        80.75,
        85.28
      ],
      [
        71.96,
        89.0
      ],
      [
        63.18,
        90.95
      ],
      [
        54.85,
        92.0
      ],
      [
        44.68,
        92.0
      ],
      [
        37.9,
        91.19
      ],
      [
        31.57,
        89.89
      ],
      [
        25.87,
        87.87
      ],
      [
        20.42,
        85.25
      ],
      [
        16.32,
        82.6
      ]
    ],
    "wallKey": "building:B_BLOK_AKADEMIK_S"
  },
  {
    "id": "B_TENNIS_NW",
    "name": "Gelanggang Tenis",
    "category": "sports",
    "zoneId": "sports",
    "emoji": "🎾",
    "description": {
      "zh": "北侧网球场，靠近 Jalan Pelaga。",
      "ms": "Gelanggang tenis di sebelah utara, berdekatan Jalan Pelaga.",
      "en": "Tennis courts on the north side, near Jalan Pelaga."
    },
    "tags": {
      "zh": [
        "体育",
        "网球"
      ],
      "ms": [
        "sukan",
        "tenis"
      ],
      "en": [
        "sports",
        "tennis"
      ]
    },
    "floors": 1,
    "hours": "06:00–22:00",
    "center": [
      -225,
      -340
    ],
    "overviewPolygon": [
      [
        8.0,
        92.0
      ],
      [
        92.0,
        92.0
      ],
      [
        92.0,
        8.0
      ],
      [
        8.0,
        8.0
      ]
    ],
    "wallKey": "building:B_TENNIS_NW"
  },
  {
    "id": "B_KOOP",
    "name": "Koperasi & Pejabat Pos",
    "category": "koop",
    "zoneId": "student-life",
    "emoji": "🛒",
    "description": {
      "zh": "KMK 学生合作社，兼营书店、文具与校内邮政服务。",
      "ms": "Koperasi pelajar KMK, kedai buku, alat tulis dan pejabat pos kampus.",
      "en": "KMK's student cooperative — a shop for books and stationery, plus the on-campus post office counter."
    },
    "tags": {
      "zh": [
        "合作社",
        "邮局",
        "商店",
        "书籍"
      ],
      "ms": [
        "koperasi",
        "pos",
        "kedai",
        "buku"
      ],
      "en": [
        "co-op",
        "post office",
        "shop",
        "books"
      ]
    },
    "floors": 1,
    "hours": "Isnin–Jumaat 08:30–17:30",
    "center": [
      -185,
      145
    ],
    "overviewPolygon": [
      [
        8.0,
        92.0
      ],
      [
        92.0,
        92.0
      ],
      [
        92.0,
        8.0
      ],
      [
        8.0,
        8.0
      ]
    ],
    "wallKey": "building:B_KOOP"
  },
  {
    "id": "B_GUARD_W",
    "name": "Pondok Pengawal Barat",
    "category": "guard",
    "zoneId": "mobility",
    "emoji": "🛡️",
    "description": {
      "zh": "西侧入口警卫亭（Persiaran Kayu Manis）。",
      "ms": "Pondok pengawal pintu masuk barat (Persiaran Kayu Manis).",
      "en": "Security post at the west entrance (Persiaran Kayu Manis)."
    },
    "tags": {
      "zh": [
        "保安",
        "警卫",
        "入口"
      ],
      "ms": [
        "keselamatan",
        "pengawal",
        "masuk"
      ],
      "en": [
        "security",
        "guard",
        "entrance"
      ]
    },
    "floors": 1,
    "hours": "24 jam",
    "center": [
      -360,
      110
    ],
    "overviewPolygon": [
      [
        8.0,
        92.0
      ],
      [
        92.0,
        92.0
      ],
      [
        92.0,
        8.0
      ],
      [
        8.0,
        8.0
      ]
    ],
    "wallKey": "building:B_GUARD_W"
  },
  {
    "id": "B_GUARD_S",
    "name": "Pondok Pengawal Selatan",
    "category": "guard",
    "zoneId": "mobility",
    "emoji": "🛡️",
    "description": {
      "zh": "南侧入口警卫亭。",
      "ms": "Pondok pengawal pintu masuk selatan.",
      "en": "Security post at the south entrance."
    },
    "tags": {
      "zh": [
        "保安",
        "警卫",
        "出口"
      ],
      "ms": [
        "keselamatan",
        "pengawal",
        "keluar"
      ],
      "en": [
        "security",
        "guard",
        "exit"
      ]
    },
    "floors": 1,
    "hours": "24 jam",
    "center": [
      0,
      260
    ],
    "overviewPolygon": [
      [
        8.0,
        92.0
      ],
      [
        92.0,
        92.0
      ],
      [
        92.0,
        8.0
      ],
      [
        8.0,
        8.0
      ]
    ],
    "wallKey": "building:B_GUARD_S"
  }
];

window.getCampusBuilding = function getCampusBuilding(id) {
  return window.CAMPUS_BUILDINGS.find(item => item.id === String(id || "")) || null;
};

window.getLocalizedBuildingText = function getLocalizedBuildingText(building, field) {
  if (!building) return "";
  const language = window.I18n?.getLanguage?.() || "en";
  const value = building[field];
  if (value && typeof value === "object" && !Array.isArray(value)) return value[language] || value.en || Object.values(value)[0] || "";
  return String(value || "");
};
