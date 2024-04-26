# Important info

## Server

In order to use our apis Node.js is required.
We created 3 different services, one for each conterparty, that runs with differt port:

* plumber: 8080
* constructor: 8081
* electritian: 8082

### Step to run servers

For each counterparty you should follow:
1. Go into './services/{counterparty_name}/src'
2. Run into terminal 'npm start'

**Documentation:** localhost:{port_number}/docs

**Example of a call:** localhost:{port_number}/v1/{path_to_call}


## Postman
In each counterpart's folder there is a folder called 'postman' that contains the collection of all calls to the server in order to test the provided apis.

[how to import a collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data)


### plumber
* Check Status: It uses all the get to test all possible status of a work
* New Quotation: It posts a new quote to plumber and, then, it checks the status of the new quote
* Send Confirmition: It confirmes the quote n4 and, then, it rejects two times quote number 0 to test that at the first attempt it changes the status and finally it allerts that a confirmation is already sent.

### electrician
* Contracts: Contains the methods to post a new contract covering all the possibilities (there already exists a contract related to a certain work and whether there is or not a related work), if the contract doesn't violate the contraints, based on the lenght of the message we decide whether or not the quotation was selected as a winner or not.
* Quotations: Contains the gets to obtain multiple and single resources, based on the parameters costumerId and workId
* Works: Contains the method to request a new work to the electrician, a quotation is returned containing the workId and costumerId related to the work, the same workId has to be used for the quotation and the contract related to the aforesaid work.
### constructor
* Accept a new quotation: It gets the work areas, it requests a new quotation based on a compatible area and it confirms the work with the constructor
* Reject a new quotation: It gets the work areas, it requests a new quotation based on a compatible area and it rejects the work with the constructor
* Inserted a wrong area: It gets the work areas and it requests a new quotation specifying an area that is not present in the constructor's available areas
