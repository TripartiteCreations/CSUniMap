#include <iostream>
#include <fstream>
#include <sstream>

#include <httplib.h>

int main()
{
    httplib::Server server;


    if (!server.set_mount_point("/", CSU_FRONTEND_PATH))
    {
        std::cerr << "ERROR: Could not mount frontend directory.\n";
        std::cerr << "Path: " << CSU_FRONTEND_PATH << "\n";
        return 1;
    }


    // API


    server.Get("/api/test",
        [](const httplib::Request&, httplib::Response& res)
        {
            res.set_content(
                R"({
                "success": true,
                "message": "C++ backend is working!",
                "server": "CSUniMap",
                "version": "0.1.0"
            })",
                "application/json"
            );
        });


    server.Get("/api/map",
        [](const httplib::Request&, httplib::Response& res)
        {
            std::ifstream file(CSU_MAP_DATA_PATH);

            if (!file.is_open())
            {
                res.status = 500;

                res.set_content(
                    R"({
                    "success": false,
                    "error": "Could not open export.json"
                })",
                    "application/json"
                );

                return;
            }

            std::stringstream buffer;
            buffer << file.rdbuf();

            res.set_content(
                buffer.str(),
                "application/json"
            );
        });





    std::cout << "CSUniMap Server\n";
    std::cout << "Website : http://localhost:8080/\n";
    std::cout << "Test    : http://localhost:8080/api/test\n";
    std::cout << "Map     : http://localhost:8080/api/map\n";


    if (!server.listen("0.0.0.0", 8080))
    {
        std::cerr << "Failed to start server on port 8080.\n";
        return 1;
    }

    return 0;
}