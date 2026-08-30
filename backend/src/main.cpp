#include <iostream>
#include <httplib.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main()
{
    httplib::Server server;

    // Test API
    server.Get("/api/test", [](const httplib::Request&, httplib::Response& res)
        {
            json response = {
                {"success", true},
                {"message", "C++ backend is working!"},
                {"server", "CSUniMap"},
                {"version", "0.1.0"}
            };

            res.set_content(response.dump(), "application/json");
        });

 
    std::cout << "CSU MiniMap Server\n";

    std::cout << "Server: http://localhost:8080\n";
    std::cout << "Test:   http://localhost:8080/api/test\n";
    std::cout << "\n";

    if (!server.listen("0.0.0.0", 8080))
    {
        std::cerr << "Failed to start server on port 8080.\n";
        return 1;
    }

    return 0;
}