Here are steps to setup Elastic Search in a dev environment

1. Open command prompt and change directory to src/search
2. Run docker-compose up
3. Navigate to Kibana UI http://localhost:5601/ and login using credentials (elastic/changeme)
4. In Menu, navigate to Enterprise Search -> App Search
5. Under Engines, click Create an engine
6. Name the engine "parks-information"
7. Once engine is created, click Upload a JSON file
8. Select the indexProtectedAreas.json file to upload
9. Once successful, the engine should be ready and you can use the sample Search UI for the engine to test it out
