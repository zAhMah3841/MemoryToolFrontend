.pragma library

// ==========================================
// 1. ЧИСТЫЕ ДАННЫЕ ИЗ HTML ДЛЯ МОДЕЛЕЙ QML
// ==========================================

// Список процессов (из файла code1.html)
var processesList = [
    { pid: "0x1A4F", name: "kworker/u4:2", rss: "12.4 MB", vms: "4.2 GB", heap: "8.1 MB", stack: "132 KB", mapped: 42, status: "critical" },
    { pid: "0x0B22", name: "postgres_main", rss: "512.0 MB", vms: "1.8 GB", heap: "256.0 MB", stack: "8 MB", mapped: 156, status: "normal" },
    { pid: "0x2F11", name: "node_server", rss: "845.2 MB", vms: "1.2 GB", heap: "790.0 MB", stack: "2 MB", mapped: 89, status: "active" },
    { pid: "0x0001", name: "systemd", rss: "4.1 MB", vms: "22.0 MB", heap: "1.2 MB", stack: "132 KB", mapped: 12, status: "normal" },
    { pid: "0x11A3", name: "docker-proxy", rss: "18.5 MB", vms: "712.0 MB", heap: "14.0 MB", stack: "8 MB", mapped: 24, status: "normal" }
];

// Карта памяти выбранного процесса (из файла code.html)
var selectedProcessMap = [
    { address: "00007FF7B4C00000 - B4C01000", type: "Image", perm: "R--", size: "4 KB", severity: "normal" },
    { address: "00007FF7B4C01000 - B565F000", type: "Image", perm: "R-X", size: "10,616 KB", severity: "error" },
    { address: "000001B340000000 - 40040000", type: "Heap", perm: "RW-", size: "256 KB", severity: "warning" },
    { address: "00000045B1A00000 - B1A04000", type: "Stack", perm: "RW-", size: "16 KB", severity: "warning" },
    { address: "0000000000000000 - 00010000", type: "Free", perm: "---", size: "64 KB", severity: "info" },
    { address: "00007FFD30800000 - 30A5F000", type: "Mapped", perm: "R-X", size: "2,428 KB", severity: "error" }
];

// Данные Hex-дампа (из файла code.html)
var hexDumpData = [
    { offset: "B4C00000", bytesLeft: ["4D", "5A", "90", "00", "03", "00", "00", "00"], bytesRight: ["04", "00", "00", "00", "FF", "FF", "00", "00"], ascii: "MZ..........ÿÿ.." },
    { offset: "B4C00010", bytesLeft: ["B8", "00", "00", "00", "00", "00", "00", "00"], bytesRight: ["40", "00", "00", "00", "00", "00", "00", "00"], ascii: "¸.......@......." },
    { offset: "B4C00020", bytesLeft: ["00", "00", "00", "00", "00", "00", "00", "00"], bytesRight: ["00", "00", "00", "00", "00", "00", "00", "00"], ascii: "................" },
    { offset: "B4C00030", bytesLeft: ["00", "00", "00", "00", "00", "00", "00", "00"], bytesRight: ["F8", "00", "00", "00", "00", "00", "00", "00"], ascii: "........ø......." },
    { offset: "B4C00040", bytesLeft: ["0E", "1F", "BA", "0E", "00", "B4", "09", "CD"], bytesRight: ["21", "B8", "01", "4C", "CD", "21", "54", "68"], ascii: "..º..´.Í!¸.LÍ!Th" },
    { offset: "B4C00050", bytesLeft: ["69", "73", "20", "70", "72", "6F", "67", "72"], bytesRight: ["61", "6D", "20", "63", "61", "6E", "6E", "6F"], ascii: "is progra manno" },
    { offset: "B4C00060", bytesLeft: ["74", "20", "62", "65", "20", "72", "75", "6E"], bytesRight: ["20", "69", "6E", "20", "44", "4F", "53", "20"], ascii: "t be run in DOS " },
    { offset: "B4C00070", bytesLeft: ["6D", "6F", "64", "65", "2E", "0D", "0D", "0A"], bytesRight: ["24", "00", "00", "00", "00", "00", "00", "00"], ascii: "mode....$......." }
];

// ==========================================
// 2. ФУНКЦИИ ПЕРЕДАЧИ ДАННЫХ В NATIVE QML
// ==========================================

function populateProcessModel(listModel) {
    listModel.clear();
    for (var i = 0; i < processesList.length; i++) {
        listModel.append(processesList[i]);
    }
}

function populateMemoryMapModel(listModel) {
    listModel.clear();
    for (var i = 0; i < selectedProcessMap.length; i++) {
        listModel.append(selectedProcessMap[i]);
    }
}

// ==========================================
// 3. ГЕНЕРАЦИЯ ЦЕЛОГО HTML ДЛЯ WEBVIEW
// ==========================================
// Если вы хотите отображать макет "один в один" через встроенный браузер

function getProcessListHtml() {
    return `
    <!DOCTYPE html><html class="dark" lang="en"><head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Core Dump - Process Analysis</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com" rel="preconnect">
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&amp;family=JetBrains+Mono:wght@400;700&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
    <script id="tailwind-config">
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        "colors": {
                            "on-error-container": "#ffdad6",
                            "inverse-primary": "#005ac2",
                            "surface-container-low": "#1c1b1b",
                            "on-primary-fixed-variant": "#004395",
                            "tertiary": "#d0bcff",
                            "surface-container-highest": "#353534",
                            "secondary-fixed": "#6ffbbe",
                            "on-background": "#e5e2e1",
                            "surface-variant": "#353534",
                            "on-primary": "#002e6a",
                            "primary-fixed-dim": "#adc6ff",
                            "on-secondary-fixed-variant": "#005236",
                            "outline": "#8c909f",
                            "surface": "#131313",
                            "primary-container": "#4d8eff",
                            "error-container": "#93000a",
                            "surface-bright": "#393939",
                            "surface-container-high": "#2a2a2a",
                            "on-error": "#690005",
                            "inverse-on-surface": "#313030",
                            "tertiary-fixed": "#e9ddff",
                            "outline-variant": "#424754",
                            "secondary-container": "#00a572",
                            "primary": "#adc6ff",
                            "on-primary-fixed": "#001a42",
                            "on-secondary": "#003824",
                            "error": "#ffb4ab",
                            "secondary-fixed-dim": "#4edea3",
                            "on-tertiary-fixed": "#23005c",
                            "tertiary-container": "#a078ff",
                            "surface-container": "#201f1f",
                            "inverse-surface": "#e5e2e1",
                            "surface-container-lowest": "#0e0e0e",
                            "surface-dim": "#131313",
                            "on-surface-variant": "#c2c6d6",
                            "tertiary-fixed-dim": "#d0bcff",
                            "on-surface": "#e5e2e1",
                            "background": "#131313",
                            "surface-tint": "#adc6ff",
                            "on-secondary-fixed": "#002113",
                            "on-secondary-container": "#00311f",
                            "on-tertiary": "#3c0091",
                            "primary-fixed": "#d8e2ff",
                            "on-tertiary-container": "#340080",
                            "secondary": "#4edea3",
                            "on-primary-container": "#00285d",
                            "on-tertiary-fixed-variant": "#5516be"
                        },
                        "borderRadius": {
                            "DEFAULT": "0.125rem",
                            "lg": "0.25rem",
                            "xl": "0.5rem",
                            "full": "0.75rem"
                        },
                        "spacing": {
                            "stack-lg": "16px",
                            "stack-md": "8px",
                            "gutter": "12px",
                            "stack-sm": "4px",
                            "container-padding": "16px",
                            "unit": "4px"
                        },
                        "fontFamily": {
                            "headline-md": ["Inter"],
                            "data-mono": ["JetBrains Mono"],
                            "body-sm": ["Inter"],
                            "body-md": ["Inter"],
                            "label-caps": ["Inter"],
                            "data-mono-bold": ["JetBrains Mono"],
                            "headline-lg": ["Inter"]
                        },
                        "fontSize": {
                            "headline-md": ["18px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                            "data-mono": ["13px", { "lineHeight": "18px", "fontWeight": "400" }],
                            "body-sm": ["12px", { "lineHeight": "16px", "fontWeight": "400" }],
                            "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                            "label-caps": ["11px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700" }],
                            "data-mono-bold": ["13px", { "lineHeight": "18px", "fontWeight": "700" }],
                            "headline-lg": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" }]
                        }
                    }
                }
            }
        </script>
    <style>
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            /* Custom scrollbar for data dense views */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #131313;
            }
            ::-webkit-scrollbar-thumb {
                background: #424754;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #8c909f;
            }
        </style>
    </head>
    <body class="bg-surface text-on-surface font-body-md h-screen w-screen overflow-hidden flex antialiased">
    <!-- SideNavBar (Shared Component) -->
    <nav class="h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant z-20 flex flex-col py-container-padding transition-all">
    <div class="px-container-padding mb-8 flex flex-col gap-1">
    <span class="font-headline-md text-headline-md text-primary font-bold">Core Dump</span>
    <span class="font-data-mono text-data-mono text-on-surface-variant text-[10px]">V 2.0.4-STABLE</span>
    </div>
    <div class="flex flex-col flex-1 gap-1">
    <!-- Active Tab -->
    <a class="flex items-center gap-3 px-container-padding py-2 text-secondary font-bold border-l-2 border-secondary bg-surface-container-high transition-colors duration-200 ease-in-out" href="#">
    <span class="material-symbols-outlined text-[20px]" data-weight="fill" style="font-variation-settings: 'FILL' 1;">memory</span>
    <span class="font-body-md text-body-md">Processes</span>
    </a>
    <!-- Inactive Tabs -->
    <a class="flex items-center gap-3 px-container-padding py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors duration-200 ease-in-out" href="#">
    <span class="material-symbols-outlined text-[20px]">analytics</span>
    <span class="font-body-md text-body-md">System Stats</span>
    </a>
    <a class="flex items-center gap-3 px-container-padding py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors duration-200 ease-in-out" href="#">
    <span class="material-symbols-outlined text-[20px]">settings</span>
    <span class="font-body-md text-body-md">Settings</span>
    </a>
    </div>
    <div class="px-container-padding mt-auto flex items-center gap-3">
    <div class="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden">
    <span class="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
    </div>
    <div class="flex flex-col">
    <span class="font-body-sm text-body-sm text-on-surface">SYS_ADMIN</span>
    </div>
    </div>
    </nav>
    <!-- Main Content Wrapper -->
    <main class="flex-1 flex flex-col ml-64 relative h-full w-[calc(100%-16rem)]">
    <!-- TopNavBar (Shared Component) -->
    <header class="fixed top-0 right-0 w-[calc(100%-16rem)] bg-surface dark:bg-surface border-b border-outline-variant z-10 flex justify-between items-center h-16 px-container-padding">
    <div class="flex items-center gap-4">
    <div class="flex items-center bg-surface-container-lowest border border-outline-variant rounded-DEFAULT px-3 py-1.5 focus-within:border-primary transition-colors">
    <span class="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">search</span>
    <input class="bg-transparent border-none outline-none text-data-mono font-data-mono text-on-surface w-64 placeholder:text-outline text-sm p-0 focus:ring-0" placeholder="Search memory space..." type="text">
    </div>
    </div>
    <div class="flex items-center gap-2">
    <button class="p-2 text-on-surface-variant hover:text-primary transition-opacity active:opacity-80 rounded-DEFAULT hover:bg-surface-container">
    <span class="material-symbols-outlined text-[20px]">notifications</span>
    </button>
    <button class="p-2 text-on-surface-variant hover:text-primary transition-opacity active:opacity-80 rounded-DEFAULT hover:bg-surface-container">
    <span class="material-symbols-outlined text-[20px]">memory</span>
    </button>
    <button class="p-2 text-on-surface-variant hover:text-primary transition-opacity active:opacity-80 rounded-DEFAULT hover:bg-surface-container">
    <span class="material-symbols-outlined text-[20px]">terminal</span>
    </button>
    </div>
    </header>
    <!-- Canvas / Workspace -->
    <div class="flex-1 overflow-y-auto mt-16 mb-8 p-container-padding flex flex-col gap-stack-lg">
    <!-- Process Header Area -->
    <div class="flex items-end justify-between w-full">
    <div class="flex items-center gap-4">
    <div class="w-12 h-12 rounded-DEFAULT bg-surface-container-high border border-outline-variant flex items-center justify-center">
    <span class="material-symbols-outlined text-primary text-[24px]">terminal</span>
    </div>
    <div>
    <h1 class="font-headline-lg text-headline-lg text-on-surface flex items-center gap-3">
                                chrome.exe
                                <span class="font-data-mono-bold text-data-mono-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-sm">PID: 10482</span>
    </h1>
    <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">NT AUTHORITY\SYSTEM • Base: 0x00007FF7B4C00000</p>
    </div>
    </div>
    <div class="flex items-center gap-stack-md">
    <button class="px-3 py-1.5 border border-outline-variant text-on-surface font-body-sm rounded-DEFAULT hover:bg-surface-container transition-colors flex items-center gap-2">
    <span class="material-symbols-outlined text-[16px]">pause</span> Suspend
                        </button>
    <button class="px-3 py-1.5 border border-outline-variant text-on-surface font-body-sm rounded-DEFAULT hover:bg-surface-container transition-colors flex items-center gap-2">
    <span class="material-symbols-outlined text-[16px]">download</span> Dump Memory
                        </button>
    <button class="px-3 py-1.5 bg-error-container text-on-error-container font-body-sm rounded-DEFAULT hover:bg-error-container/80 transition-colors flex items-center gap-2 border border-error/20">
    <span class="material-symbols-outlined text-[16px]">close</span> Terminate
                        </button>
    </div>
    </div>
    <!-- Top Section: Memory Allocation Bar Chart -->
    <div class="bg-surface-container-low border border-outline-variant rounded-lg p-container-padding flex flex-col gap-stack-md shadow-sm">
    <div class="flex justify-between items-center mb-1">
    <h2 class="font-headline-md text-headline-md text-on-surface text-[14px]">Virtual Memory Allocation</h2>
    <span class="font-data-mono text-data-mono text-on-surface-variant">Total Commit: 2.4 GB / 8.0 GB Limit</span>
    </div>
    <!-- The Segmented Bar -->
    <div class="w-full h-6 rounded-sm bg-surface-container-lowest border border-outline flex overflow-hidden">
    <div class="h-full bg-primary-container relative group cursor-pointer" style="width: 45%;">
    <!-- Tooltip structural pattern, implemented simply via hover state in a real app, keeping it CSS driven here where possible or implied -->
    </div>
    <div class="h-full bg-tertiary-container border-l border-surface-container-lowest" style="width: 15%;"></div>
    <div class="h-full bg-secondary-container border-l border-surface-container-lowest" style="width: 10%;"></div>
    <div class="h-full bg-surface-variant border-l border-surface-container-lowest" style="width: 30%;"></div>
    </div>
    <!-- Legend -->
    <div class="flex items-center gap-6 mt-2">
    <div class="flex items-center gap-2">
    <div class="w-3 h-3 rounded-sm bg-primary-container"></div>
    <span class="font-body-sm text-body-sm text-on-surface-variant">Private Data (1.08 GB)</span>
    </div>
    <div class="flex items-center gap-2">
    <div class="w-3 h-3 rounded-sm bg-tertiary-container"></div>
    <span class="font-body-sm text-body-sm text-on-surface-variant">Mapped File (360 MB)</span>
    </div>
    <div class="flex items-center gap-2">
    <div class="w-3 h-3 rounded-sm bg-secondary-container"></div>
    <span class="font-body-sm text-body-sm text-on-surface-variant">Image (240 MB)</span>
    </div>
    <div class="flex items-center gap-2">
    <div class="w-3 h-3 rounded-sm bg-surface-variant border border-outline-variant"></div>
    <span class="font-body-sm text-body-sm text-on-surface-variant">Free (720 MB)</span>
    </div>
    </div>
    </div>
    <!-- Middle Section: Split View Grid -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-gutter min-h-[500px]">
    <!-- LEFT PANEL: Memory Map Table -->
    <div class="bg-surface-container-low border border-outline-variant rounded-lg flex flex-col overflow-hidden shadow-sm">
    <div class="px-container-padding py-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
    <h3 class="font-headline-md text-headline-md text-on-surface text-[14px]">Memory Map</h3>
    <div class="flex gap-2">
    <button class="text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined text-[16px]">filter_list</span></button>
    </div>
    </div>
    <div class="flex-1 overflow-auto">
    <table class="w-full text-left border-collapse">
    <thead class="sticky top-0 bg-surface-container-low border-b border-outline-variant z-10">
    <tr>
    <th class="font-label-caps text-label-caps text-on-surface-variant px-4 py-2 uppercase">Address Range</th>
    <th class="font-label-caps text-label-caps text-on-surface-variant px-4 py-2 uppercase">Type</th>
    <th class="font-label-caps text-label-caps text-on-surface-variant px-4 py-2 uppercase">Perm</th>
    <th class="font-label-caps text-label-caps text-on-surface-variant px-4 py-2 uppercase text-right">Size</th>
    </tr>
    </thead>
    <tbody class="font-data-mono text-data-mono text-on-surface-variant">
    <!-- Row 1 Active -->
    <tr class="border-b border-outline-variant/50 bg-primary/5 cursor-pointer">
    <td class="px-4 py-2 text-primary">00007FF7B4C00000 - B4C01000</td>
    <td class="px-4 py-2"><span class="bg-secondary/15 text-secondary px-1.5 py-0.5 rounded-sm text-[11px]">Image</span></td>
    <td class="px-4 py-2"><span class="text-on-surface">R--</span></td>
    <td class="px-4 py-2 text-right">4 KB</td>
    </tr>
    <!-- Row 2 -->
    <tr class="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors cursor-pointer">
    <td class="px-4 py-2">00007FF7B4C01000 - B565F000</td>
    <td class="px-4 py-2"><span class="bg-secondary/15 text-secondary px-1.5 py-0.5 rounded-sm text-[11px]">Image</span></td>
    <td class="px-4 py-2"><span class="text-error">R-X</span></td>
    <td class="px-4 py-2 text-right">10,616 KB</td>
    </tr>
    <!-- Row 3 -->
    <tr class="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors cursor-pointer">
    <td class="px-4 py-2">000001B340000000 - 40040000</td>
    <td class="px-4 py-2"><span class="bg-primary-container/20 text-primary-fixed-dim px-1.5 py-0.5 rounded-sm text-[11px]">Heap</span></td>
    <td class="px-4 py-2"><span class="text-tertiary">RW-</span></td>
    <td class="px-4 py-2 text-right">256 KB</td>
    </tr>
    <!-- Row 4 -->
    <tr class="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors cursor-pointer">
    <td class="px-4 py-2">00000045B1A00000 - B1A04000</td>
    <td class="px-4 py-2"><span class="bg-tertiary/15 text-tertiary px-1.5 py-0.5 rounded-sm text-[11px]">Stack</span></td>
    <td class="px-4 py-2"><span class="text-tertiary">RW-</span></td>
    <td class="px-4 py-2 text-right">16 KB</td>
    </tr>
    <!-- Row 5 -->
    <tr class="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors cursor-pointer">
    <td class="px-4 py-2 text-outline">0000000000000000 - 00010000</td>
    <td class="px-4 py-2"><span class="bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded-sm text-[11px]">Free</span></td>
    <td class="px-4 py-2"><span class="text-outline">---</span></td>
    <td class="px-4 py-2 text-right">64 KB</td>
    </tr>
    <!-- Row 6 -->
    <tr class="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors cursor-pointer">
    <td class="px-4 py-2">00007FFD30800000 - 30A5F000</td>
    <td class="px-4 py-2"><span class="bg-secondary/15 text-secondary px-1.5 py-0.5 rounded-sm text-[11px]">Mapped</span></td>
    <td class="px-4 py-2"><span class="text-error">R-X</span></td>
    <td class="px-4 py-2 text-right">2,428 KB</td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
    <!-- RIGHT PANEL: Hex Viewer -->
    <div class="bg-surface-container-low border border-outline-variant rounded-lg flex flex-col overflow-hidden shadow-sm">
    <!-- Hex Header -->
    <div class="px-container-padding py-2 border-b border-outline-variant bg-surface-container-low flex justify-between items-center h-[45px]">
    <div class="flex items-center gap-3">
    <span class="font-headline-md text-headline-md text-on-surface text-[14px]">Inspector</span>
    <div class="bg-surface-container-lowest border border-outline-variant rounded-sm flex items-center px-2 py-0.5">
    <span class="font-data-mono text-data-mono text-outline select-none">0x</span>
    <input class="bg-transparent border-none outline-none text-data-mono text-primary w-[140px] p-0 text-sm focus:ring-0" type="text" value="00007FF7B4C00000">
    </div>
    </div>
    <div class="flex gap-2">
    <select class="bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-body-sm rounded-sm py-0.5 pl-2 pr-6 text-xs focus:ring-primary focus:border-primary">
    <option>8-bit (1 byte)</option>
    <option>16-bit (2 bytes)</option>
    <option>32-bit (4 bytes)</option>
    </select>
    </div>
    </div>
    <!-- Hex Content Area -->
    <div class="flex-1 overflow-auto bg-surface-container-lowest p-4 relative">
    <!-- Column Headers -->
    <div class="flex font-data-mono-bold text-[12px] text-outline mb-2 sticky top-0 bg-surface-container-lowest z-10 pb-2 border-b border-outline-variant/30">
    <div class="w-32">Offset</div>
    <div class="flex-1 flex justify-between px-4 tracking-[0.2em]">
    <span class="">00 01 02 03 04 05 06 07</span>
    <span class="">08 09 0A 0B 0C 0D 0E 0F</span>
    </div>
    <div class="w-32 text-right">Decoded text</div>
    </div>
    <!-- Data Rows (Simulated) -->
    <div class="font-data-mono text-[13px] leading-[22px] text-on-surface-variant whitespace-pre flex flex-col">
    <div class="flex hover:bg-surface-container-low">
    <div class="w-32 text-primary">B4C00000</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="text-tertiary">4D</span><span class="text-tertiary">5A</span><span class="">90</span><span class="">00</span><span class="">03</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">04</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">FF</span><span class="">FF</span><span class="">00</span><span class="">00</span></div>
    </div>
    <div class="w-32 text-outline text-right">MZ..........ÿÿ..</div>
    </div>
    <div class="flex hover:bg-surface-container-low">
    <div class="w-32 text-primary">B4C00010</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">B8</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">40</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    </div>
    <div class="w-32 text-outline text-right">¸.......@.......</div>
    </div>
    <div class="flex hover:bg-surface-container-low bg-surface-container-high relative">
    <!-- Highlighted selection indicator -->
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
    <div class="w-32 text-primary pl-1">B4C00020</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    </div>
    <div class="w-32 text-outline text-right">................</div>
    </div>
    <div class="flex hover:bg-surface-container-low">
    <div class="w-32 text-primary">B4C00030</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="bg-tertiary/20 text-tertiary-fixed">F8</span><span class="bg-tertiary/20 text-tertiary-fixed">00</span><span class="bg-tertiary/20 text-tertiary-fixed">00</span><span class="bg-tertiary/20 text-tertiary-fixed">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    </div>
    <div class="w-32 text-outline text-right">........ø.......</div>
    </div>
    <div class="flex hover:bg-surface-container-low">
    <div class="w-32 text-primary">B4C00040</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">0E</span><span class="">1F</span><span class="">BA</span><span class="">0E</span><span class="">00</span><span class="">B4</span><span class="">09</span><span class="">CD</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">21</span><span class="">B8</span><span class="">01</span><span class="">4C</span><span class="">CD</span><span class="">21</span><span class="">54</span><span class="">68</span></div>
    </div>
    <div class="w-32 text-outline text-right">..º..´.Í!¸.LÍ!Th</div>
    </div>
    <div class="flex hover:bg-surface-container-low">
    <div class="w-32 text-primary">B4C00050</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">69</span><span class="">73</span><span class="">20</span><span class="">70</span><span class="">72</span><span class="">6F</span><span class="">67</span><span class="">72</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">61</span><span class="">6D</span><span class="">20</span><span class="">63</span><span class="">61</span><span class="">6E</span><span class="">6E</span><span class="">6F</span></div>
    </div>
    <div class="w-32 text-on-surface text-right">is progra manno</div>
    </div>
    <div class="flex hover:bg-surface-container-low">
    <div class="w-32 text-primary">B4C00060</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">74</span><span class="">20</span><span class="">62</span><span class="">65</span><span class="">20</span><span class="">72</span><span class="">75</span><span class="">6E</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">20</span><span class="">69</span><span class="">6E</span><span class="">20</span><span class="">44</span><span class="">4F</span><span class="">53</span><span class="">20</span></div>
    </div>
    <div class="w-32 text-on-surface text-right">t be run in DOS </div>
    </div>
    <div class="flex hover:bg-surface-container-low">
    <div class="w-32 text-primary">B4C00070</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">6D</span><span class="">6F</span><span class="">64</span><span class="">65</span><span class="">2E</span><span class="">0D</span><span class="">0D</span><span class="">0A</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">24</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    </div>
    <div class="w-32 text-on-surface text-right">mode....$.......</div>
    </div>
    <div class="flex hover:bg-surface-container-low opacity-50">
    <div class="w-32 text-primary">B4C00080</div>
    <div class="flex-1 flex px-4">
    <div class="w-1/2 flex gap-1.5"><span class="">50</span><span class="">45</span><span class="">00</span><span class="">00</span><span class="">64</span><span class="">86</span><span class="">06</span><span class="">00</span></div>
    <div class="w-1/2 flex gap-1.5 ml-2"><span class="">0B</span><span class="">5E</span><span class="">17</span><span class="">65</span><span class="">00</span><span class="">00</span><span class="">00</span><span class="">00</span></div>
    </div>
    <div class="w-32 text-outline text-right">PE..d†...^.e....</div>
    </div>
    <!-- Spacer for scroll simulation -->
    <div class="h-32"></div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <!-- Footer (Shared Component) -->
    <footer class="fixed bottom-0 right-0 w-[calc(100%-16rem)] h-8 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant z-10 flex items-center justify-between px-gutter transition-all text-secondary">
    <span class="font-data-mono-bold text-data-mono-bold">Kernel Space Status: Synchronized</span>
    <div class="flex items-center gap-4">
    <a class="font-data-mono text-data-mono text-on-surface-variant hover:bg-surface-container-low transition-all px-2 py-0.5 rounded-sm" href="#">System Up: 12h 4m</a>
    <a class="font-data-mono text-data-mono text-on-surface-variant hover:bg-surface-container-low transition-all px-2 py-0.5 rounded-sm" href="#">RAM: 4.2GB / 16GB</a>
    <a class="font-data-mono text-data-mono text-on-surface-variant hover:bg-surface-container-low transition-all px-2 py-0.5 rounded-sm" href="#">CPU: 12%</a>
    </div>
    </footer>
    </main>


    </body></html>`;
}