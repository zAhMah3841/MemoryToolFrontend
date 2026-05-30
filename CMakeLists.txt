cmake_minimum_required(VERSION 3.16)

project(appMemoryManagementToolFrontend VERSION 0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Ищем все необходимые компоненты Qt6
find_package(Qt6 COMPONENTS Quick Charts Widgets REQUIRED)

# Включаем автоматическую обработку MOC, RCC и UIC
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Создаем исполняемый файл и добавляем main.cpp и ресурсы qml
qt_add_executable(appMemoryManagementToolFrontend
    main.cpp
    res.qrc
)

# Связываем библиотеки
target_link_libraries(appMemoryManagementToolFrontend PRIVATE
    Qt6::Quick
    Qt6::Charts
    Qt6::Widgets
)