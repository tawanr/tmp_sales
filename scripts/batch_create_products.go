package main

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type Product struct {
	lotNumber     string
	label         string
	price         int
	kg            int
	unit          string
	is_active     bool
	priceByWeight bool
}

func main() {
	file, err := os.Open("products.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	requestUrl := "https://wasp-poetic-definitely.ngrok-free.app/api/collections/products/records"

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		product := map[string]interface{}{
			"lotNumber":     record[0],
			"label":         record[1],
			"price":         record[2],
			"kg":            record[3],
			"unit":          record[4],
			"is_active":     true,
			"priceByWeight": record[5] == "Y",
		}

		jsonString, err := json.Marshal(product)
		fmt.Println(string(jsonString))
		bodyReader := bytes.NewReader(jsonString)

		req, err := http.NewRequest(http.MethodPost, requestUrl, bodyReader)
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			log.Fatal(err)
		}
		defer resp.Body.Close()
		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err)
		}
		bodyString := string(respBody)
		fmt.Printf("%s\n\n", bodyString)
	}
}
