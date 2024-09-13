from locust import HttpUser, task, between, SequentialTaskSet

class VisitPages(SequentialTaskSet):
    @task(1)
    def visit_pages(self):
        self.client.get("/")
        print("Visited Home Page")
        self.client.get("find-a-park/")
        print("Visited Find a Park page")
        self.client.get("contact/")
        print("Visited Contact page")
        self.client.get("about/")
        print("Visited About page")
        self.client.get("/active-advisories/")
        print("Visited Advisories page")

class FindParkPages(SequentialTaskSet):
    @task(1)
    def find_park_page(self):
        self.client.get("adams-lake-marine-park/")
        self.client.get("adams-lake-park-bush-creek-site/")
        self.client.get("akamina-kishinena-park/")
        self.client.get("alexandra-bridge-park/")
        self.client.get("aleza-lake-ecological-reserve/")
        self.client.get("alice-lake-park/")
        self.client.get("joffre-lakes-park/")
        self.client.get("garibaldi-park/")
        self.client.get("bowron-lake-park/")
        self.client.get("valhalla-park/")
        self.client.get("mount-robson-park/")


class SearchforPark(SequentialTaskSet):
    @task(2)
    def visit_pages_in_order(self):
        self.client.get("/")
        self.client.get("active-advisories/")
        self.client.get("/find-a-park/")

    @task(3)
    def find_a_park_by_park_name(self):
        self.client.post("find-a-park/", {"search": "Joffre Lakes Park"})
        self.client.get("joffre-lakes-park/")

    @task(1)
    def find_a_park_by_city(self):
        self.client.post("find-a-park/", {"search": "Vancouver"})
        self.client.get("cypress-park/")

class WebsiteUser(HttpUser):
    host = "http://localhost:8000/"
    wait_time = between(1, 5)
    tasks = [VisitPages, FindParkPages, SearchforPark]

