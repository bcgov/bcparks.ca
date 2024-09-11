from locust import HttpUser, task, between, TaskSet

class VisitPages(TaskSet):
    @task
    def visit_pages(self):
        self.client.get("/")
        print("Visited Home Page")
        self.client.get("find-a-park/")
        print("Visited Find a Park Page")
        self.client.get("contact/")
        print("Visited Contact Page")
        self.client.get("about/")
        print("Visited About Page")

class FindPark(TaskSet):
    @task
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
        
class WebsiteUser(HttpUser):
    host = "http://localhost:8000/"
    wait_time = between(1, 5)
    tasks = [VisitPages, FindPark]

