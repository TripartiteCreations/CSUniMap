find_package(httplib CONFIG REQUIRED)

add_executable(CSU_Minimap_Server
    src/main.cpp
)


target_link_libraries(CSU_Minimap_Server
    PRIVATE
        httplib::httplib
)

get_target_property(HTTPLIB_INCLUDE_DIRS httplib::httplib INTERFACE_INCLUDE_DIRECTORIES)

message(STATUS "HTTPLIB INCLUDE DIRS: ${HTTPLIB_INCLUDE_DIRS}")