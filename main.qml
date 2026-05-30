import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ApplicationWindow {
    id: root
    width: 1280
    height: 720
    visible: true
    title: "Core Dump - Memory Analyzer"
    color: "#131313" // bg-background

    // --- Локальная загрузка шрифтов ---
    FontLoader { id: interFont; source: "qrc:/fonts/fonts/Inter-Regular.ttf" }
    FontLoader { id: interBold; source: "qrc:/fonts/fonts/Inter-Bold.ttf" }
    FontLoader { id: jbMono; source: "qrc:/fonts/fonts/JetBrainsMono-Regular.ttf" }
    FontLoader { id: jbMonoBold; source: "qrc:/fonts/fonts/JetBrainsMono-Bold.ttf" }
    FontLoader { id: materialIcons; source: "qrc:/fonts/fonts/MaterialSymbolsOutlined-VariableFont_FILL,GRAD,opsz,wght.ttf" }

    // --- Цветовая палитра ---
    QtObject {
        id: theme
        property color background: "#131313"
        property color surfaceContainerLow: "#1c1b1b"
        property color surfaceContainerHigh: "#2a2a2a"
        property color surfaceContainerLowest: "#0e0e0e"
        property color outlineVariant: "#424754"
        property color primary: "#adc6ff"
        property color secondary: "#4edea3"
        property color tertiary: "#d0bcff"
        property color error: "#ffb4ab"
        property color surface: "#e5e2e1"
        property color underSurfaceVariant: "#c2c6d6"
        property color surfaceVariant: "#353534"
    }

    // --- Верхняя панель (TopNavBar) ---
    Rectangle {
        id: topBar
        height: 64
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        color: theme.background
        border.color: theme.outlineVariant
        border.width: 1

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 16
            anchors.rightMargin: 16

            // Строка поиска
            Rectangle {
                Layout.preferredWidth: 400
                Layout.preferredHeight: 36
                color: "#161616"
                border.color: theme.outlineVariant
                radius: 4
                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 12
                    Text { text: "\ue8b6"; font.family: materialIcons.name; color: theme.underSurfaceVariant } // search
                    TextInput {
                        Layout.fillWidth: true
                        color: theme.surface
                        font.family: interFont.name
                        font.pixelSize: 12
                        text: "Search processes, PIDs..."
                    }
                }
            }

            Item { Layout.fillWidth: true } // Спайсер
        }
    }

    // --- Основная рабочая область (Main Content Canvas) ---
    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: topBar.bottom
        anchors.bottom: footer.top
        anchors.margins: 16
        color: "#1E1E1E"
        border.color: "#2D2D2D"
        radius: 8

        ColumnLayout {
                    id: mainColumn // <-- ДОБАВЛЕН ЯВНЫЙ ID
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 0

                    // Состояния сортировки
                    property string sortField: "pid"
                    property bool sortAscending: true

                    // Функция логики сортировки
                    function sortModel(field) {
                        if (sortField === field) {
                            sortAscending = !sortAscending;
                        } else {
                            sortField = field;
                            sortAscending = true;
                        }

                        // Переносим данные из ListModel в обычный JS-массив
                        var dataData = [];
                        for (var i = 0; i < processModel.count; i++) {
                            var item = processModel.get(i);
                            dataData.push({
                                pid: item.pid,
                                name: item.name,
                                rss: item.rss,
                                vms: item.vms,
                                heap: item.heap,
                                stack: item.stack,
                                mapped: item.mapped
                            });
                        }

                        // Функция для конвертации строк памяти
                        var parseToBytes = function(v) {
                            if (typeof v !== "string") return v;
                            var trimmed = v.trim();
                            var match = trimmed.match(/^([\d.]+)\s*([KMGT]B)?$/i);
                            if (!match) return isNaN(trimmed) ? trimmed : parseFloat(trimmed);

                            var num = parseFloat(match[1]);
                            var unit = match[2] ? match[2].toUpperCase() : "";

                            if (unit === "KB") num *= 1024;
                            else if (unit === "MB") num *= 1024 * 1024;
                            else if (unit === "GB") num *= 1024 * 1024 * 1024;
                            return num;
                        };

                        // Сортируем массив
                        dataData.sort(function(a, b) {
                            var valA = parseToBytes(a[field]);
                            var valB = parseToBytes(b[field]);

                            if (typeof valA === "string" && typeof valB === "string") {
                                return sortAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
                            } else {
                                return sortAscending ? (valA - valB) : (valB - valA);
                            }
                        });

                        // Перезаписываем ListModel
                        processModel.clear();
                        for (var j = 0; j < dataData.length; j++) {
                            processModel.append(dataData[j]);
                        }
                    }

                    // Заголовок таблицы и кнопки
                    RowLayout {
                        Layout.fillWidth: true
                        Layout.bottomMargin: 10
                        Text { text: "List processes"; color: theme.surface; font.family: interBold.name; font.pixelSize: 18; Layout.fillWidth: true }
                    }

        // --- ФИКСИРОВАННЫЙ И ИНТЕРАКТИВНЫЙ ЗАГОЛОВОК ТАБЛИЦЫ ---
                    RowLayout {
                        id: headerRow
                        Layout.fillWidth: true
                        // Жестко фиксируем высоту строки для ColumnLayout
                        Layout.preferredHeight: 30
                        Layout.maximumHeight: 30
                        spacing: 0

                        function getHeaderLabel(text, field) {
                            if (mainColumn.sortField === field) {
                                return text + (mainColumn.sortAscending ? " ▲" : " ▼");
                            }
                            return text;
                        }

                        MouseArea {
                            Layout.preferredWidth: 80
                            Layout.fillHeight: true // Теперь это безопасно, так как высота строки заблокирована
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: mainColumn.sortModel("pid")
                            Text {
                                anchors.fill: parent
                                leftPadding: 16
                                text: headerRow.getHeaderLabel("PID", "pid")
                                color: mainColumn.sortField === "pid" ? theme.secondary : theme.underSurfaceVariant
                                font.family: interBold.name; font.pixelSize: 11
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        MouseArea {
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: mainColumn.sortModel("name")
                            Text {
                                anchors.fill: parent
                                text: headerRow.getHeaderLabel("NAME", "name")
                                color: mainColumn.sortField === "name" ? theme.secondary : theme.underSurfaceVariant
                                font.family: interBold.name; font.pixelSize: 11
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        MouseArea {
                            Layout.preferredWidth: 90
                            Layout.fillHeight: true
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: mainColumn.sortModel("rss")
                            Text {
                                anchors.fill: parent
                                text: headerRow.getHeaderLabel("RSS", "rss")
                                color: mainColumn.sortField === "rss" ? theme.secondary : theme.underSurfaceVariant
                                font.family: interBold.name; font.pixelSize: 11
                                horizontalAlignment: Text.AlignRight
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        MouseArea {
                            Layout.preferredWidth: 90
                            Layout.fillHeight: true
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: mainColumn.sortModel("vms")
                            Text {
                                anchors.fill: parent
                                text: headerRow.getHeaderLabel("VMS", "vms")
                                color: mainColumn.sortField === "vms" ? theme.secondary : theme.underSurfaceVariant
                                font.family: interBold.name; font.pixelSize: 11
                                horizontalAlignment: Text.AlignRight
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        MouseArea {
                            Layout.preferredWidth: 90
                            Layout.fillHeight: true
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: mainColumn.sortModel("heap")
                            Text {
                                anchors.fill: parent
                                text: headerRow.getHeaderLabel("HEAP", "heap")
                                color: mainColumn.sortField === "heap" ? theme.secondary : theme.underSurfaceVariant
                                font.family: interBold.name; font.pixelSize: 11
                                horizontalAlignment: Text.AlignRight
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        MouseArea {
                            Layout.preferredWidth: 90
                            Layout.fillHeight: true
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: mainColumn.sortModel("stack")
                            Text {
                                anchors.fill: parent
                                text: headerRow.getHeaderLabel("STACK", "stack")
                                color: mainColumn.sortField === "stack" ? theme.secondary : theme.underSurfaceVariant
                                font.family: interBold.name; font.pixelSize: 11
                                horizontalAlignment: Text.AlignRight
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        MouseArea {
                            Layout.preferredWidth: 90
                            Layout.fillHeight: true
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: mainColumn.sortModel("mapped")
                            Text {
                                anchors.fill: parent
                                rightPadding: 20
                                text: headerRow.getHeaderLabel("MAPPED", "mapped")
                                color: mainColumn.sortField === "mapped" ? theme.secondary : theme.underSurfaceVariant
                                font.family: interBold.name; font.pixelSize: 11
                                horizontalAlignment: Text.AlignRight
                                verticalAlignment: Text.AlignVCenter
                               }
                        }
                    }

                    // --- ПРОКРУЧИВАЕМЫЙ СПИСОК (ListView) ---
                    ListView {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        clip: true
                        model: ListModel {
                            id: processModel
                            ListElement { pid: "1488"; name: "femboy_futta_house"; rss: "12.4 MB"; vms: "4.2 GB"; heap: "8.1 MB"; stack: "132 KB"; mapped: "42" }
                            ListElement { pid: "228"; name: "firefox_with_pornhub"; rss: "512.0 MB"; vms: "1.8 GB"; heap: "256.0 MB"; stack: "8 MB"; mapped: "156" }
                            ListElement { pid: "67"; name: "z_archlinux"; rss: "845.2 MB"; vms: "1.2 GB"; heap: "790.0 MB"; stack: "2 MB"; mapped: "89" }
                        }

                        delegate: Rectangle {
                            id: delegateItem
                            width: ListView.view ? ListView.view.width : parent.width
                            height: 40
                            color: rowMouseArea.containsMouse ? theme.surfaceContainerHigh : "transparent"
                            border.color: "#2D2D2D"
                            border.width: 1

                            MouseArea {
                                id: rowMouseArea
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor

                                onClicked: {
                                    var component = Qt.createComponent("AnalysisView.qml");
                                    if (component.status === Component.Ready) {
                                        var analysisWindow = component.createObject(root);
                                        analysisWindow.show();
                                    } else {
                                        console.error("Ошибка загрузки окна анализа:", component.errorString());
                                    }
                                }
                            }

                            RowLayout {
                                anchors.fill: parent
                                spacing: 0

                                Text {
                                    text: model.pid
                                    color: theme.secondary
                                    font.family: jbMonoBold.name
                                    font.pixelSize: 13
                                    Layout.preferredWidth: 80
                                    leftPadding: 16
                                }

                                Text {
                                    text: model.name
                                    color: theme.surface
                                    font.family: interFont.name
                                    font.pixelSize: 13
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: model.rss
                                    color: theme.underSurfaceVariant
                                    font.family: jbMono.name
                                    font.pixelSize: 13
                                    Layout.preferredWidth: 90
                                    horizontalAlignment: Text.AlignRight
                                }

                                Text {
                                    text: model.vms
                                    color: theme.underSurfaceVariant
                                    font.family: jbMono.name
                                    font.pixelSize: 13
                                    Layout.preferredWidth: 90
                                    horizontalAlignment: Text.AlignRight
                                }

                                Text {
                                    text: model.heap
                                    color: theme.underSurfaceVariant
                                    font.family: jbMono.name
                                    font.pixelSize: 13
                                    Layout.preferredWidth: 90
                                    horizontalAlignment: Text.AlignRight
                                }

                                Text {
                                    text: model.stack
                                    color: theme.underSurfaceVariant
                                    font.family: jbMono.name
                                    font.pixelSize: 13
                                    Layout.preferredWidth: 90
                                    horizontalAlignment: Text.AlignRight
                                }

                                Text {
                                    text: model.mapped
                                    rightPadding: 20
                                    color: theme.underSurfaceVariant
                                    font.family: jbMono.name
                                    font.pixelSize: 13
                                    Layout.preferredWidth: 90
                                    horizontalAlignment: Text.AlignRight
                                }
                            }
                        }
                    }
            }
    }

    // --- Подвал (Footer) ---
    Rectangle {
        id: footer
        height: 32
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        color: theme.surfaceContainerLowest
        border.color: theme.outlineVariant
        border.width: 1

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 12
            anchors.rightMargin: 12
            Text { text: "Status: Working"; color: theme.secondary; font.family: jbMonoBold.name; font.pixelSize: 13 }
            Item { Layout.fillWidth: true }
            Text { text: "System Up: 12h 4m"; color: theme.underSurfaceVariant; font.family: jbMono.name; font.pixelSize: 13 }
            Text { text: "RAM: 4.2GB / 16GB"; color: theme.underSurfaceVariant; font.family: jbMono.name; font.pixelSize: 13 }
            Text { text: "CPU: 12%"; color: theme.underSurfaceVariant; font.family: jbMono.name; font.pixelSize: 13 }
        }
    }
}