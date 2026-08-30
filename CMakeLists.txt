cmake_minimum_required(VERSION 3.20)

project(CSUniMap LANGUAGES CXX)

# Use C++20
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# C++ backend
add_subdirectory(backend)

# HTML/CSS/JavaScript frontend
add_subdirectory(frontend)