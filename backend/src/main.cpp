#include <iostream>
#include <httplib.h>

int main()
{
    httplib::Server server;

    server.Get("/", [](const httplib::Request&, httplib::Response& res)
        {
            res.set_content(
                "<h1>CSU MiniMap</h1><p>Hello from C++!</p>",
                "text/html"
            );
        });

    std::cout << "CSU MiniMap Server starting...\n";
    std::cout << "Open: http://localhost:8080\n";

    if (!server.listen("0.0.0.0", 8080))
    {
        std::cerr << "ERROR: Failed to start server on port 8080.\n";
        return 1;
    }

    return 0;
}