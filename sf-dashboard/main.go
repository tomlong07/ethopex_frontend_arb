package main

import (
	"log"
	"net/http"
)

func main() {
	// Serve thư mục dist
	fs := http.FileServer(http.Dir("./dist"))

	// Nếu bạn muốn route "/" trỏ về index.html (cho SPA như Vue)
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Thử mở file trong dist
		_, err := http.Dir("./dist").Open(r.URL.Path)
		if err != nil {
			// Nếu không có file thì fallback về index.html
			http.ServeFile(w, r, "./dist/index.html")
			return
		}
		fs.ServeHTTP(w, r)
	}))

	log.Println("Server running at http://localhost:9999")
	log.Fatal(http.ListenAndServe(":9999", nil))
}
