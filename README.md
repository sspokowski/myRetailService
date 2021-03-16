# myRetailService

## Project overview
This a web service built on NodeJS using Express.  It is backed by a MongoDB document database and it uses Axios, a promise-based HTTP client, to retrieve data from an external API.

I had intended to use Jest for unit testing, but I didn't actually end up writing any/very much code that was unit testable.  Instead, I opted to test using Postman and created a 'collection' that gets executed via Newman.  These tests can be executed using ```npm test``` and theyh also run after the server is deployed.

The API specification for this service can be found here.  It was documented using the OpenAPI v3 specification and is built using Swagger.

## Background
myRetail is a rapidly growing company with HQ in Richmond, VA and over 200 stores across the east coast. 
myRetail wants to make its internal data available to any number of client devices, from myRetail.com to native mobile apps. 
The goal for this exercise is to create an end-to-end Proof-of-Concept for a products API, which will aggregate product data from multiple sources and return it as JSON to the caller. 

Your goal is to create a RESTful service that can retrieve product and price details by ID. 
The URL structure is up to you to define, but try to follow some sort of logical convention.

## Requirements
Build an application that performs the following actions: 

Responds to an HTTP GET request at /products/{id} and delivers product data as JSON (where {id} will be a number. 
Example product IDs: 13860428, 54456119, 13264003, 12954218) 

Example response: 
```{
    "id":13860428,
    "name":"The Big Lebowski (Blu-ray) (Widescreen)",
    "current_price":{
        "value": 13.49,
        "currency_code":"USD"
        }
    }
```

Performs an HTTP GET to retrieve the product name from an external API. 
(For this exercise the data will come from redsky.target.com, but let’s just pretend this is an internal resource hosted by myRetail) 

Example: 
https://redsky.target.com/v3/pdp/tcin/13860428?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics&ey=candidate

Reads pricing information from a NoSQL data store and combines it with the product id and name from the HTTP request into a single response. 

BONUS: Accepts an HTTP PUT request at the same path (/products/{id}), containing a JSON request body similar to the GET response, and updates the product’s price in the data store. 

