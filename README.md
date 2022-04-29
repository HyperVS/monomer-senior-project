# Monomer Senior Project

The zip file contains our demo video as well as all of our source code. The source code is split into 3 folders: Backend, Frontend, and Post-Processing.

## To compile and run the code, execute the following commands:

First, cd into the Frontend directory, install dependencies and build:
    
    cd Frontend && npm install && npm run build

Then cd into the Backend directory

    cd .. && cd Backend/roi

Finally, run the backend:

    go run main.go

Note: a local installation of PostgreSQL needs to be present.

