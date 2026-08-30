find_package(httplib CONFIG REQUIRED)

add_executable(CSU_Minimap_Server
    src/main.cpp
)

target_link_libraries(CSU_Minimap_Server
    PRIVATE
        httplib::httplib
)

target_compile_definitions(CSU_Minimap_Server
    PRIVATE
        CSU_MAP_DATA_PATH="${CMAKE_CURRENT_SOURCE_DIR}/data/map.geojson"
        CSU_FRONTEND_PATH="${CMAKE_SOURCE_DIR}/frontend"
)