#include <QApplication>
#include <QQmlApplicationEngine>
#include <iostream>

int main(int argc, char *argv[])
{
    // Включаем поддержку экранов с высоким разрешением (актуально для Qt 5.x)
    // В Qt 6 это поведение включено по умолчанию.
#if QT_VERSION < QT_VERSION_CHECK(6, 0, 0)
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
#endif

    // ВАЖНО: Используем QApplication (из модуля Widgets), а не QGuiApplication!
    // Это необходимо для корректной работы модуля QtCharts внутри QML.
    QApplication app(argc, argv);

    QQmlApplicationEngine engine;

    // Путь к вашему главному QML-файлу.
    // В зависимости от системы сборки (qmake или CMake) и версии Qt, строка ниже может немного отличаться.

    // Стандартный вариант для qmake (через файл ресурсов .qrc):
    const QUrl url("qrc:/main.qml");

    // ВАЖНО ДЛЯ CMAKE В Qt6: Если вы используете qt_add_qml_module,
    // путь формируется из имени таргета. Закомментируйте строку выше и раскомментируйте эту:
    // const QUrl url(u"qrc:/appMemoryManagementToolFrontend/main.qml"_qs);

    // Подключаем сигнал, чтобы приложение корректно завершилось,
    // если QML-файл не сможет загрузиться (например, ошибка в синтаксисе или неверный путь).

    // Загружаем интерфейс
    engine.load(url);

    // Запускаем главный цикл обработки событий (Event Loop)
    return app.exec();
}