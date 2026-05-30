# Additional clean files
cmake_minimum_required(VERSION 3.16)

if("${CONFIG}" STREQUAL "" OR "${CONFIG}" STREQUAL "Debug")
  file(REMOVE_RECURSE
  "CMakeFiles/appMemoryManagementToolFrontend_autogen.dir/AutogenUsed.txt"
  "CMakeFiles/appMemoryManagementToolFrontend_autogen.dir/ParseCache.txt"
  "appMemoryManagementToolFrontend_autogen"
  )
endif()
