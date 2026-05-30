import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15
import QtCharts 2.15

ApplicationWindow {
    visible: true
    width: 1200
    height: 800
    title: "Анализатор памяти процессов"

    // Главный разделитель (Лево - Право)
    SplitView {
        anchors.fill: parent
        orientation: Qt.Horizontal

        // ==========================================
        // 1. СПИСОК ПРОЦЕССОВ И ИНФОРМАЦИЯ О НИХ
        // ==========================================
        Rectangle {
            SplitView.preferredWidth: 400
            SplitView.minimumWidth: 300
            color: "#f4f4f4"
            border.color: "#cccccc"

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 10

                Label {
                    text: "Список процессов"
                    font.bold: true
                    font.pixelSize: 16
                }

                ListView {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    clip: true
                    model: processModel

                    delegate: Rectangle {
                        width: parent.width
                        height: 100
                        color: index % 2 === 0 ? "#ffffff" : "#f9f9f9"
                        border.color: "#eeeeee"
                        radius: 5

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 8
                            spacing: 2

                            Text { text: "<b>" + name + "</b> (PID: " + pid + ")"; font.pixelSize: 14 }
                            Text { text: "Физ. память: " + physMem + " | Вирт. память: " + virtMem; font.pixelSize: 12; color: "#555" }
                            Text { text: "Куча: " + heapSize + " | Стек: " + stackSize; font.pixelSize: 12; color: "#555" }
                            Text { text: "Mapped файлы: " + mappedSize; font.pixelSize: 12; color: "#555" }
                        }

                        MouseArea {
                            anchors.fill: parent
                            onClicked: {
                                // Здесь можно добавить логику обновления графиков при клике
                                console.log("Выбран процесс: " + name)
                            }
                        }
                    }
                }
            }
        }

        // Правая часть (Графики и дамп)
        SplitView {
            orientation: Qt.Vertical
            SplitView.fillWidth: true

            // ==========================================
            // 2. ДИАГРАММА ИСПОЛЬЗОВАНИЯ ПАМЯТИ
            // ==========================================
            Rectangle {
                SplitView.preferredHeight: 350
                SplitView.minimumHeight: 250
                color: "#ffffff"

                ChartView {
                    anchors.fill: parent
                    title: "Использование выделенной памяти (выбранный процесс)"
                    titleFont.pointSize: 14
                    titleFont.bold: true
                    antialiasing: true
                    legend.alignment: Qt.AlignRight

                    PieSeries {
                        id: memorySeries
                        PieSlice { label: "Использовано (1.2 ГБ)"; value: 75; color: "#e74c3c" }
                        PieSlice { label: "Свободно (0.4 ГБ)"; value: 25; color: "#2ecc71" }
                    }
                }
            }

            // ==========================================
            // 3. БЛОКИ ПАМЯТИ И HEX-ДАМП
            // ==========================================
            SplitView {
                orientation: Qt.Horizontal
                SplitView.fillHeight: true

                // Левая часть: Тип данных и права доступа
                Rectangle {
                    SplitView.preferredWidth: 350
                    SplitView.minimumWidth: 200
                    color: "#ffffff"
                    border.color: "#cccccc"

                    ColumnLayout {
                        anchors.fill: parent
                        anchors.margins: 10

                        Label {
                            text: "Регионы памяти"
                            font.bold: true
                        }

                        ListView {
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            clip: true
                            model: memoryRegionsModel

                            delegate: Rectangle {
                                width: parent.width
                                height: 50
                                color: "#f9f9f9"
                                border.color: "#e0e0e0"

                                ColumnLayout {
                                    anchors.centerIn: parent
                                    Text { text: "Тип: <b>" + type + "</b>"; font.pixelSize: 13 }
                                    Text { text: "Доступ: " + access; color: access === "rwx" ? "red" : "black"; font.pixelSize: 12 }
                                }
                            }
                        }
                    }
                }

                // Правая часть: Hex-содержимое
                Rectangle {
                    SplitView.fillWidth: true
                    color: "#1e1e1e" // Темная тема для Hex-редактора смотрится лучше

                    ColumnLayout {
                        anchors.fill: parent
                        anchors.margins: 10

                        Label {
                            text: "Hex Dump (Содержимое)"
                            color: "#ffffff"
                            font.bold: true
                        }

                        TextArea {
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            readOnly: true
                            color: "#d4d4d4"
                            font.family: "Courier" // Моноширинный шрифт обязателен для Hex
                            font.pixelSize: 14
                            background: null
                            text: "0x00007FFAA12B  48 89 5C 24 08 57 48 83  H.\\$.WH.\n" +
                                  "0x00007FFAA133  EC 20 48 8B DA 48 8B F9  . H..H..\n" +
                                  "0x00007FFAA13B  48 85 D2 74 27 44 8B C2  H..t'D..\n" +
                                  "0x00007FFAA143  44 89 44 24 18 4C 8D 4C  D.D$.L.L\n" +
                                  "0x00007FFAA14B  24 18 48 8D 54 24 18 48  $.H.T$.H\n" +
                                  "0x00007FFAA153  8D 0D A6 3E 00 00 E8 12  ...>....\n"
                        }
                    }
                }
            }
        }
    }

    // ==========================================
    // МОДЕЛИ ДАННЫХ (Для демонстрации)
    // ==========================================
    ListModel {
        id: processModel
        ListElement { name: "chrome.exe"; pid: 14502; physMem: "450 MB"; virtMem: "1.2 GB"; heapSize: "200 MB"; stackSize: "2 MB"; mappedSize: "150 MB" }
        ListElement { name: "explorer.exe"; pid: 3024; physMem: "120 MB"; virtMem: "800 MB"; heapSize: "50 MB"; stackSize: "1 MB"; mappedSize: "80 MB" }
        ListElement { name: "devenv.exe"; pid: 9980; physMem: "1.5 GB"; virtMem: "4.0 GB"; heapSize: "800 MB"; stackSize: "4 MB"; mappedSize: "500 MB" }
        ListElement { name: "system"; pid: 4; physMem: "2 MB"; virtMem: "8 MB"; heapSize: "0 MB"; stackSize: "0 MB"; mappedSize: "1 MB" }
    }

    ListModel {
        id: memoryRegionsModel
        ListElement { type: "Стек (Stack)"; access: "rw-" }
        ListElement { type: "Куча (Heap)"; access: "rw-" }
        ListElement { type: "Исполняемый код (.text)"; access: "r-x" }
        ListElement { type: "Данные (.data)"; access: "rw-" }
        ListElement { type: "JIT-компиляция"; access: "rwx" } // Подсветится красным в UI
    }
}