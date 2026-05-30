import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQml.Models

ApplicationWindow {
    id: root
    width: 1280
    height: 720
    visible: true
    title: "Core Dump - Process Analysis"
    color: "#131313"

    // --- Шрифты ---
    FontLoader { id: interFont; source: "qrc:/fonts/fonts/Inter-Regular.ttf" }
    FontLoader { id: jbMono; source: "qrc:/fonts/fonts/JetBrainsMono-Regular.ttf" }
    FontLoader { id: materialIcons; source: "qrc:/fonts/fonts/MaterialSymbolsOutlined-VariableFont_FILL,GRAD,opsz,wght.ttf" }

    // Цвета (упрощенный блок для автономности файла)
    QtObject {
        id: theme
        property color bg: "#131313"
        property color surfaceLow: "#1c1b1b"
        property color primary: "#adc6ff"
        property color primaryContainer: "#4d8eff"
        property color secondary: "#4edea3"
        property color secondaryContainer: "#00a572"
        property color tertiary: "#d0bcff"
        property color tertiaryContainer: "#a078ff"
        property color error: "#ffb4ab"
        property color outline: "#424754"
        property color surface: "#e5e2e1"
        property color surfaceVariant: "#c2c6d6"
    }

    // Боковая панель, Топ-бар и Подвал идентичны первому файлу.
    // Для экономии места в примере мы их опустим, оставив место под контент.

    // --- Контент анализа процесса ---
    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 16
        spacing: 16

        // 1. Заголовок процесса и действия
        RowLayout {
            Layout.fillWidth: true
            ColumnLayout {
                RowLayout {
                    Text { text: "chrome.exe"; color: theme.surface; font.family: interFont.name; font.pixelSize: 24; font.bold: true }
                    Rectangle {
                        color: Qt.rgba(theme.secondary.r, theme.secondary.g, theme.secondary.b, 0.15)
                        width: pidText.width + 10; height: pidText.height + 4; radius: 2
                        Text { id: pidText; text: "PID: 10482"; color: theme.secondary; font.family: jbMono.name; font.pixelSize: 13; anchors.centerIn: parent }
                    }
                }
                Text { text: "Own: zhmh"; color: theme.surfaceVariant; font.family: interFont.name; font.pixelSize: 12 }
            }
            Item { Layout.fillWidth: true }
            Button { text: "Dump Memory" }
        }

        // 2. Индикатор памяти (Segmented Bar)
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 110 // Немного увеличил, чтобы поместились отступы легенды
            color: theme.surfaceLow
            border.color: theme.outline
            radius: 8

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 16
                spacing: 12

                // Верхняя строчка: Текст заголовка и лимиты
                RowLayout {
                    Layout.fillWidth: true
                    Text { text: "Virtual Memory Allocation"; color: theme.surface; font.family: interFont.name; font.pixelSize: 14 }
                    Item { Layout.fillWidth: true } // Пружина, расталкивающая текст по краям
                    Text { text: "Total Commit: 2.4 GB / 8.0 GB Limit"; color: theme.surfaceVariant; font.family: jbMono.name; font.pixelSize: 13 }
                }

                // --- ИСПРАВЛЕННЫЙ БЛОК: Сам бар ---
                // Оборачиваем в базовый Item, который без проблем растягивается макетом Layout.fillWidth
                Item {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 24

                    // Внутри используем обычный Row — у него нет конфликтов со свойством parent.width
                    Row {
                        anchors.fill: parent
                        spacing: 0

                        Rectangle { height: parent.height; width: parent.width * 0.45; color: theme.primaryContainer }
                        Rectangle { height: parent.height; width: parent.width * 0.15; color: theme.tertiaryContainer }
                        Rectangle { height: parent.height; width: parent.width * 0.10; color: theme.secondaryContainer }
                        Rectangle { height: parent.height; width: parent.width * 0.30; color: "#353534" }
                    }
                }

                // Легенда
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 24

                    RowLayout {
                        spacing: 8 // Отступ между цветным квадратом и текстом
                        Rectangle { width: 12; height: 12; color: theme.primaryContainer; radius: 2 }
                        Text { text: "Private Data (1.08 GB)"; color: theme.surfaceVariant; font.family: interFont.name; font.pixelSize: 12 }
                    }

                    RowLayout {
                        spacing: 8
                        Rectangle { width: 12; height: 12; color: theme.tertiaryContainer; radius: 2 }
                        Text { text: "Mapped File (360 MB)"; color: theme.surfaceVariant; font.family: interFont.name; font.pixelSize: 12 }
                    }

                    RowLayout {
                        spacing: 8
                        Rectangle { width: 12; height: 12; color: theme.secondaryContainer; radius: 2 }
                        Text { text: "Image (408 MB)"; color: theme.surfaceVariant; font.family: interFont.name; font.pixelSize: 12 }
                    }

                    RowLayout {
                        spacing: 8
                        Rectangle { width: 12; height: 12; color: theme.outline; radius: 2 }
                        Text { text: "Free (5 PB)"; color: theme.surfaceVariant; font.family: interFont.name; font.pixelSize: 12 }
                    }
                    // Сюда можно добавлять остальные элементы легенды аналогичным образом
                }
            }
        }

        // 3. Split View: Карта памяти (слева) и Hex Viewer (справа)
        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 12

            // Левая панель: Таблица Memory Map
            Rectangle {
                Layout.fillHeight: true
                Layout.preferredWidth: parent.width * 0.45
                color: theme.surfaceLow; border.color: theme.outline; radius: 8

                ColumnLayout {
                    anchors.fill: parent
                    Rectangle {
                        Layout.fillWidth: true; Layout.preferredHeight: 40; color: "transparent"; border.color: theme.outline
                        // Заголовок таблицы карты памяти
                        RowLayout {
                            anchors.fill: parent; anchors.margins: 12
                            Text { text: "Memory Map"; color: theme.surface; font.family: interFont.name; font.pixelSize: 14 }
                        }
                    }
                    // Здесь должен быть ListView для карты памяти
                    Item { Layout.fillWidth: true; Layout.fillHeight: true }
                }
            }

            // Правая панель: Hex Viewer
            Rectangle {
                Layout.fillHeight: true
                Layout.fillWidth: true
                color: theme.surfaceLow; border.color: theme.outline; radius: 8

                ColumnLayout {
                    anchors.fill: parent

                    // Header (Inspector / Combobox)
                    Rectangle {
                        Layout.fillWidth: true; Layout.preferredHeight: 45
                        color: "transparent"; border.color: theme.outline
                        RowLayout {
                            anchors.fill: parent; anchors.margins: 12
                            Text { text: "Inspector"; color: theme.surface; font.family: interFont.name; font.pixelSize: 14 }
                            TextInput { text: "0x00007FF7B4C00000"; color: theme.primary; font.family: jbMono.name; readOnly: true }
                        }
                    }

                    // Hex Content Area (с фиксированным моноширинным шрифтом)
                    Flickable {
                        Layout.fillWidth: true; Layout.fillHeight: true
                        contentHeight: hexColumn.height
                        clip: true

                        Column {
                            id: hexColumn
                            padding: 16
                            spacing: 4
                            // Имитация одной строки Hex
                            RowLayout {
                                Text { text: "B4C00000"; color: theme.primary; font.family: jbMono.name; font.pixelSize: 13; Layout.preferredWidth: 100 }
                                Text { text: "4D 5A 90 00 03 00 00 00  04 00 00 00 FF FF 00 00"; color: theme.surfaceVariant; font.family: jbMono.name; font.pixelSize: 13; Layout.fillWidth: true }
                                Text { text: "MZ..........ÿÿ.."; color: theme.outline; font.family: jbMono.name; font.pixelSize: 13; Layout.preferredWidth: 120 }
                            }
                            // Дополнительные строки генерируются через Repeater или ListView...
                        }
                    }
                }
            }
        }
    }
}